import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MethodListType } from '../../../types';
import { Button, Box, CircularProgress } from '@mui/material';
import { useMethod, usePurchase } from '../../../hooks/useData';
import ContextInputDialog from './ContextInputDialog';

interface ReceiptScannerProps {
    setNewPurchase: (name: string, value: string | Date | boolean | MethodListType | null) => void;
}

const ReceiptScanner = ({ setNewPurchase }: ReceiptScannerProps) => {
    const { categorySet } = usePurchase();
    const { methodList } = useMethod();
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [receiptDataArray, setReceiptDataArray] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [contextDialogOpen, setContextDialogOpen] = useState<boolean>(false);
    const [geminiContext, setGeminiContext] = useState<string>('');

    useEffect(() => {
        const storedContext = localStorage.getItem('geminiContext');
        if (storedContext) {
            setGeminiContext(storedContext);
        }
    }, []);

    const handleCapture = () => {
        inputRef.current?.click();
    };

    // Converts local file information to base64
    function fileToGenerativePart(image: string, mimeType: string) {
        return {
            inlineData: {
                data: image.split(',')[1],
                mimeType,
            },
        };
    }

    const sendImageToGemini = async (image: string) => {
        setLoading(true);

        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            alert('Please set the GEMINI_API_KEY environment variable.');
            setLoading(false);
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            console.log(
                JSON.stringify(
                    methodList.map((m) => ({
                        id: m.id,
                        label: m.label,
                    }))
                )
            );
            // TODO: 将来的に含めたい「商品がレシートに書いてない場合は、レシートの店舗の業態などから推測・検索して大雑把なカテゴリーでいいので商品を書いてください。」
            const defaultContext = `Extract the purchase information from this receipt and return it as a JSON array with the following format. Write all the detailed information in the "description" field.
            一つのレシートで、複数のJSONオブジェクトを返してください。
            具体的な商品の情報がレシートにない場合は、description欄を空にしてください。伝票番号など不必要な情報は書かないでください
            categorySet: ${JSON.stringify(categorySet)}
            methodList: ${JSON.stringify(
                methodList.map((m) => ({
                    id: m.id,
                    label: m.label,
                }))
            )}
            [
              {
                "title": "品目",　# 「商品を買った商店名+商品名」を約10~20文字程度でできるだけ詳細に書いてください　商店名は、運営企業などではなく、レシートの頭のロゴなどに書いてある一般的な名称を書いて下さい。複数の商品がある場合は「商品を買った商店名+その商品群を総称した名称」にしてその際「購入品」「商品」など一般的すぎる言葉ではなく、「食料品と雑貨品」「入浴関連商品とラーメン」など、購入した商品のうち、大多数を占めるものをもっとも狭い範囲でまとめた言葉を使ってください type:string
                "price": "金額", # type:number
                "date": "日付", # type:date YYYY-MM-DD HH:MM:SS
                "category": "カテゴリー", # type:string
                "description": "備考", # type:string
                "method": "支払い方法", # methodListのmethodのid type:string
                "income": "収支" # type:boolean optional default:false
              }
            ]`;
            const textPart = geminiContext
                ? `優先プロンプト：${geminiContext}\n次のプロンプトが優先プロンプトと矛盾する場合は優先プロンプトに従ってください\nプロンプト：${defaultContext}`
                : defaultContext;

            console.log('Sending text to Gemini:', textPart);
            const imageParts = fileToGenerativePart(image, 'image/jpeg');
            const generatedContent = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [imageParts, { text: textPart }],
                    },
                ],
                // tools: [{ googleSearchRetrieval: {} }], 今は使えない。画像と検索は同時にできない
            });

            handleGeminiResponse(generatedContent.response.text());
        } catch (error) {
            console.error('Error sending image to Gemini:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const image = reader.result as string;
                setImage(image);
                await sendImageToGemini(image);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGeminiResponse = (text: string) => {
        // TODO: Implement the logic to handle the response from Gemini.
        console.log('Gemini response:', text);
        try {
            const jsonString = text.replace(/```json\n|\n```/g, '');
            const response = JSON.parse(jsonString);
            console.log('Parsed Gemini response:', response);
            if (Array.isArray(response)) {
                setReceiptDataArray(response);
                setCurrentIndex(0);
                parseGeminiResponse(response[0]);
            } else {
                console.error('Expected an array from Gemini, but received:', response);
            }
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
        }
    };

    const parseGeminiResponse = (item: any) => {
        // TODO: Implement the logic to parse the text and update the purchase input fields.
        console.log('Parsing Gemini response:', item);
        setNewPurchase('title', item.title);
        setNewPurchase('price', item.price);
        setNewPurchase('date', new Date(item.date));
        setNewPurchase('category', item.category);
        setNewPurchase('description', item.description);
        setNewPurchase('method', item.method);
        setNewPurchase('income', item.income);
    };

    const handleNext = () => {
        if (currentIndex < receiptDataArray.length - 1) {
            setCurrentIndex(currentIndex + 1);
            parseGeminiResponse(receiptDataArray[currentIndex + 1]);
        }
    };

    const handleContextSave = (context: string) => {
        setGeminiContext(context);
        localStorage.setItem('geminiContext', context);
    };

    const handleContextClose = () => {
        setContextDialogOpen(false);
    };

    const handleContextOpen = () => {
        setContextDialogOpen(true);
    };

    return (
        <Box gap={1} sx={{ m: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                ref={inputRef}
            />
            {image && <img src={image} alt="Receipt" style={{ maxWidth: '300px' }} />}
            <Box gap={1} display="flex" alignItems="center">
                <Button variant="contained" onClick={handleCapture} disabled={loading}>
                    レシート
                </Button>
                <Button variant="contained" onClick={handleResend} disabled={loading || !image}>
                    再送信
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                        loading ||
                        receiptDataArray.length === 0 ||
                        currentIndex >= receiptDataArray.length - 1
                    }
                >
                    次へ ({currentIndex + 1} / {receiptDataArray.length})
                </Button>
                <Button variant="contained" onClick={handleContextOpen} disabled={loading}>
                    Context
                </Button>
                {loading && <CircularProgress size={24} />}
            </Box>
            <ContextInputDialog
                open={contextDialogOpen}
                onClose={handleContextClose}
                onSave={handleContextSave}
                initialContext={geminiContext}
            />
        </Box>
    );

    async function handleResend() {
        if (image) {
            await sendImageToGemini(image);
        }
    }
};

export default ReceiptScanner;
