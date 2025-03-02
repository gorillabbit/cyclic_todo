import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MethodListType } from '../../../types';
import { Button, Box } from '@mui/material';
import { useMethod, usePurchase } from '../../../hooks/useData';

interface ReceiptScannerProps {
    setNewPurchase: (name: string, value: string | Date | boolean | MethodListType | null) => void;
}

const ReceiptScanner = ({ setNewPurchase }: ReceiptScannerProps) => {
    const { categorySet } = usePurchase();
    const { methodList } = useMethod();
    const [image, setImage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleImageChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const image = reader.result as string;
                setImage(image);

                if (!import.meta.env.VITE_GEMINI_API_KEY) {
                    alert('Please set the GEMINI_API_KEY environment variable.');
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
                    const textPart = `Extract the purchase information from this receipt and return it as a single JSON object with the following format. Write all the detailed information in the "description" field.
                    一つのレシートで、一つのJSONオブジェクトを返してください。一つのレシートで複数の商品を買っている場合もリストの形にはしないで、priceは合計金額、categoryは一番多いカテゴリーを選んで、個別の商品はdescriptionに書いてください。
                    具体的な商品の情報がレシートにない場合は、description欄を空にしてください。伝票番号など不必要な情報は書かないでください
                    categorySet: ${JSON.stringify(categorySet)}
                    methodList: ${JSON.stringify(
                        methodList.map((m) => ({
                            id: m.id,
                            label: m.label,
                        }))
                    )}
                    {
                      "title": "品目",　# 「商品を買った商店名+商品名」を約10~20文字程度でできるだけ詳細に書いてください　商店名は、運営企業などではなく、レシートの頭のロゴなどに書いてある一般的な名称を書いて下さい。複数の商品がある場合は「商品を買った商店名+その商品群を総称した名称」にしてその際「購入品」「商品」など一般的すぎる言葉ではなく、「食料品と雑貨品」「入浴関連商品とラーメン」など、購入した商品のうち、大多数を占めるものをもっとも狭い範囲でまとめた言葉を使ってください type:string
                      "price": "金額", # type:number
                      "date": "日付", # type:date YYYY-MM-DD HH:MM:SS
                      "category": "カテゴリー", # type:string
                      "description": "備考", # type:string
                      "method": "支払い方法", # methodListのmethodのid type:string
                      "income": "収支" # type:boolean optional default:false
                    }`;

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
                }
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
            parseGeminiResponse(response);
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
        }
    };

    const parseGeminiResponse = (response: any) => {
        // TODO: Implement the logic to parse the text and update the purchase input fields.
        console.log('Parsing Gemini response:', response);
        setNewPurchase('title', response.title);
        setNewPurchase('price', response.price);
        setNewPurchase('date', new Date(response.date));
        setNewPurchase('category', response.category);
        setNewPurchase('description', response.description);
        setNewPurchase('method', response.method);
        setNewPurchase('income', response.income);
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
            <Box gap={1} display="flex">
                <Button variant="contained" onClick={handleCapture}>
                    レシート撮影
                </Button>
            </Box>
        </Box>
    );
};

export default ReceiptScanner;
