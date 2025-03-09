import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MethodListType } from '../../../types';
import { Button, Box, CircularProgress, FormControlLabel, Switch, FormGroup } from '@mui/material';
import { useMethod, usePurchase } from '../../../hooks/useData';
import ContextInputDialog from './ContextInputDialog';
import { getMonth, getYear } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface ReceiptScannerProps {
    setNewPurchase: (name: string, value: string | Date | boolean | MethodListType | null) => void;
}

const ReceiptScanner = ({ setNewPurchase }: ReceiptScannerProps) => {
    // External data from hooks
    const { categorySet, purchaseList } = usePurchase();
    const { methodList } = useMethod();

    // Component states
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [receiptDataArray, setReceiptDataArray] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [contextDialogOpen, setContextDialogOpen] = useState<boolean>(false);
    const [geminiContext, setGeminiContext] = useState<string>('');
    const [sendExistingData, setSendExistingData] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const inputRef = useRef<HTMLInputElement>(null);

    // Load stored Gemini context on mount
    useEffect(() => {
        const storedContext = localStorage.getItem('geminiContext');
        if (storedContext) {
            setGeminiContext(storedContext);
        }
    }, []);

    // Trigger file selection
    const handleCapture = () => {
        inputRef.current?.click();
    };

    // Converts an image file (as a base64 string) to the format required by Gemini
    const fileToGenerativePart = (image: string, mimeType: string) => ({
        inlineData: {
            data: image.split(',')[1],
            mimeType,
        },
    });

    // Build the Gemini prompt based on component settings
    const buildGeminiPrompt = (existingPurchasesString: string) => {
        const purchaseExtractionInstruction = sendExistingData
            ? 'If the existing purchase data is provided, only extract the purchases from the receipt that are NOT already in the existing purchase data, primarily by comparing the date and price.'
            : '';
        const defaultContext = `Extract the purchase information from this receipt and return it as a JSON array with the following format. 
${purchaseExtractionInstruction}
1枚のレシートで1つのJSONオブジェクトを返してください。複数の商品がある場合でも、1つのレシートで、1つのJSONオブジェクトを返してください。
具体的な商品の情報がレシートにない場合は、description欄を空にしてください。伝票番号など不必要な情報は書かないでください
categorySet: ${JSON.stringify(categorySet)}
methodList: ${JSON.stringify(
            methodList.map((m) => ({
                id: m.id,
                label: m.label,
            }))
        )}
${sendExistingData ? `Existing purchase data: ${existingPurchasesString}` : ''}
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

        return geminiContext
            ? `優先プロンプト：${geminiContext}\n次のプロンプトが優先プロンプトと矛盾する場合は優先プロンプトに従ってください\nプロンプト：${defaultContext}`
            : defaultContext;
    };

    // Prepare the existing purchase data (if enabled) based on the selected date
    const getExistingPurchases = () => {
        if (!sendExistingData || !selectedDate) return [];
        const year = getYear(selectedDate);
        const month = getMonth(selectedDate) + 1;
        return purchaseList
            .filter(
                (purchase) =>
                    getYear(purchase.date) === year && getMonth(purchase.date) + 1 === month
            )
            .map((purchase) => ({
                date: purchase.date.toISOString().split('T')[0],
                price: Math.abs(purchase.difference),
                title: purchase.title,
                category: purchase.category,
            }));
    };

    // Send the image to Gemini for processing
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

            // Prepare existing purchase data if needed
            const existingPurchases = getExistingPurchases();
            const existingPurchasesString = JSON.stringify(existingPurchases);

            const promptText = buildGeminiPrompt(existingPurchasesString);

            const imagePart = fileToGenerativePart(image, 'image/jpeg');
            const generatedContent = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [imagePart, { text: promptText }],
                    },
                ],
            });

            handleGeminiResponse(generatedContent.response.text());
        } catch (error) {
            console.error('Error sending image to Gemini:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection and convert image to base64
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageData = reader.result as string;
                setImage(imageData);
                await sendImageToGemini(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    // Parse Gemini's response and update state accordingly
    const handleGeminiResponse = (text: string) => {
        try {
            // Remove markdown formatting if present
            const jsonString = text.replace(/```json\n|\n```/g, '');
            const response = JSON.parse(jsonString);
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

    // Update purchase fields using the parsed Gemini response
    const parseGeminiResponse = (item: any) => {
        setNewPurchase('title', item.title);
        setNewPurchase('price', item.price);
        setNewPurchase('date', new Date(item.date));
        setNewPurchase('category', item.category);
        setNewPurchase('description', item.description);
        setNewPurchase('method', item.method);
        setNewPurchase('income', item.income);
    };

    // Move to the next receipt in the array
    const handleNext = () => {
        if (currentIndex < receiptDataArray.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            parseGeminiResponse(receiptDataArray[nextIndex]);
        }
    };

    // Save and store Gemini context
    const handleContextSave = (context: string) => {
        setGeminiContext(context);
        localStorage.setItem('geminiContext', context);
    };

    const handleContextClose = () => setContextDialogOpen(false);
    const handleContextOpen = () => setContextDialogOpen(true);

    // Re-send the current image to Gemini
    const handleResend = async () => {
        if (image) {
            await sendImageToGemini(image);
        }
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
                <FormGroup row sx={{ gap: 1, mr: 1, width: '100%' }}>
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={sendExistingData}
                                onChange={(e) => setSendExistingData(e.target.checked)}
                            />
                        }
                        label="既存データ送信"
                    />
                    <DatePicker
                        label="年月を選択"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        views={['year', 'month']}
                    />
                    <Button variant="contained" onClick={handleContextOpen} disabled={loading}>
                        Context
                    </Button>
                    {loading && <CircularProgress size={24} />}
                </FormGroup>
            </Box>
            <ContextInputDialog
                open={contextDialogOpen}
                onClose={handleContextClose}
                onSave={handleContextSave}
                initialContext={geminiContext}
            />
        </Box>
    );
};

export default ReceiptScanner;
