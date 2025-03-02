import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MethodListType } from '../../../types';
import fs from 'fs';
import { Button, Box } from '@mui/material';

interface ReceiptScannerProps {
    setNewPurchase: (name: string, value: string | Date | boolean | MethodListType | null) => void;
}

const ReceiptScanner = ({ setNewPurchase }: ReceiptScannerProps) => {
    const [image, setImage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCapture = () => {
        inputRef.current?.click();
    };

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Converts local file information to base64
    function fileToGenerativePart(path: string, mimeType: string) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString('base64'),
                mimeType,
            },
        };
    }

    const handleSendToGemini = async () => {
        if (!image) {
            alert('Please capture an image first.');
            return;
        }
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            alert('Please set the GEMINI_API_KEY environment variable.');
            return;
        }

        // TODO: Implement the logic to send the image to Gemini.
        console.log('Sending image to Gemini:', image);
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            const textPart = `Extract the purchase information from this receipt and return it as a JSON object with the following format:
            {
              "title": "品目",
              "price": "金額",
              "date": "日付",
              "category": "カテゴリー",
              "description": "備考"
            }`;
            const imageParts = fileToGenerativePart(image, 'image/jpeg');
            const generatedContent = await model.generateContent([textPart, imageParts] as any);

            handleGeminiResponse(generatedContent.response.text());
        } catch (error) {
            console.error('Error sending image to Gemini:', error);
        }
    };

    const handleGeminiResponse = (text: string) => {
        // TODO: Implement the logic to handle the response from Gemini.
        console.log('Gemini response:', text);
        try {
            const response = JSON.parse(text);
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
        setNewPurchase('date', response.date);
        setNewPurchase('category', response.category);
        setNewPurchase('description', response.description);
    };

    return (
        <Box>
            <Button variant="contained" onClick={handleCapture}>
                Capture Receipt
            </Button>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                ref={inputRef}
            />
            {image && <img src={image} alt="Receipt" style={{ maxWidth: '300px' }} />}
            <Button variant="contained" onClick={handleSendToGemini} disabled={!image}>
                Send to Gemini
            </Button>
        </Box>
    );
};

export default ReceiptScanner;
