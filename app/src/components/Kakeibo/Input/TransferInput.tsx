import { Box, Button, FormGroup, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
    MethodListType,
    InputTransferType,
    defaultTransferInput,
    ErrorType,
    TransferType,
} from '../../../types';
import { getPayDate } from '../../../utilities/purchaseUtilities';
import TransferTemplateButtonsContainer from './TransferTemplateButtonContainer';
import { useMethod, usePurchase, useTab } from '../../../hooks/useData';
import { getHasError, validateTransfer } from '../KakeiboSchemas';
import MethodSelector from '../ScreenParts/MethodSelector';
import {
    createPurchase,
    createTransferTemplate,
    getTransferTemplate,
} from '../../../api/combinedApi';

const TransferInput = () => {
    const { currentUser } = getAuth();
    const { tabId } = useTab();
    const { methodList } = useMethod();
    const [newTransfer, setNewTransfer] = useState<InputTransferType>({
        ...defaultTransferInput,
        tabId,
    });
    const { fetchPurchases } = usePurchase();

    const [errors, setErrors] = useState<ErrorType>({});
    const [templateList, setTemplateList] = useState<TransferType[]>([]);

    const validateAndSetErrors = useCallback((input: InputTransferType) => {
        const errors = validateTransfer(input);
        setErrors(errors);
        return getHasError(errors);
    }, []);

    const hasError = useMemo(() => getHasError(errors), [errors]);

    const handleNewTransferInput = useCallback(
        (name: string, value: string | Date | MethodListType | null) => {
            console.log('name', name, 'value', value);
            setNewTransfer((prev) => {
                const nextTransfer = { ...prev, [name]: value };
                validateAndSetErrors(nextTransfer);
                return nextTransfer;
            });
        },
        []
    );

    const fetchTemplates = useCallback(async () => {
        const data = await getTransferTemplate({ tabId });
        setTemplateList(data);
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const addTransfer = useCallback(async () => {
        if (validateAndSetErrors(newTransfer)) {
            return console.error('エラーがあります');
        }
        if (!currentUser) {
            return console.error('ログインしていません');
        }
        const fromMethod = methodList.find((m) => m.id === newTransfer.fromMethod);
        const toMethod = methodList.find((m) => m.id === newTransfer.toMethod);
        if (!fromMethod || !toMethod) {
            return console.error('支払い方法が見つかりません');
        }
        const { price, date, description } = newTransfer;
        const basePurchase = {
            userId: currentUser.uid,
            category: '送受金',
            date,
            description,
            tabId,
            id: '',
            balance: 0,
        };
        const purchaseTitle = `${fromMethod.label}→${toMethod.label}`;
        const fromPurchase = {
            ...basePurchase,
            title: `【送】${purchaseTitle}`,
            method: fromMethod.id,
            payDate: getPayDate(fromMethod, date),
            assetId: fromMethod.assetId,
            difference: -price,
        };

        const toPurchase = {
            ...basePurchase,
            title: `【受】${purchaseTitle}`,
            method: toMethod.id,
            payDate: getPayDate(toMethod, date),
            assetId: toMethod.assetId,
            difference: price,
        };

        await createPurchase(fromPurchase);
        await createPurchase(toPurchase);
        setNewTransfer(defaultTransferInput);
        fetchPurchases();
    }, [currentUser, tabId, newTransfer]);

    const addTemplate = useCallback(async () => {
        // TODO ここの処理をaddTransferと共通化できないか考える
        if (validateAndSetErrors(newTransfer)) {
            return console.error('エラーがあります');
        }
        if (!currentUser) {
            return console.error('ログインしていません');
        }
        await createTransferTemplate({
            ...newTransfer,
            userId: currentUser.uid,
            tabId,
            id: new Date().getTime().toString(),
        });
        fetchTemplates();
    }, [currentUser, newTransfer]);

    // テンプレボタンを押したときの処理
    const useTemplate = useCallback((transfer: TransferType) => {
        // idが残ると、idが同じDocが複数作成され、削除できなくなる
        const { id, ...templateTransferWithoutId } = transfer;
        const newTemplateTransfer = {
            ...templateTransferWithoutId,
            date: new Date(),
        };
        setNewTransfer(newTemplateTransfer);
        validateAndSetErrors(newTemplateTransfer);
    }, []);

    return (
        <>
            <TransferTemplateButtonsContainer
                useTemplate={useTemplate}
                transferList={templateList}
                fetchTemplates={fetchTemplates}
            />
            <Box display="flex">
                <FormGroup row sx={{ gap: 1, mr: 1, width: '100%' }}>
                    <TextField
                        label="金額"
                        value={newTransfer.price}
                        onChange={(e) => handleNewTransferInput('price', e.target.value)}
                        error={!!errors.price}
                        helperText={errors.price}
                    />
                    <DatePicker
                        label="日付"
                        value={newTransfer.date}
                        sx={{ maxWidth: 150 }}
                        onChange={(value) => handleNewTransferInput('date', value)}
                    />
                    <MethodSelector
                        newMethod={newTransfer.fromMethod}
                        handleInput={handleNewTransferInput}
                        errors={errors.from}
                        inputName="fromMethod"
                    />
                    <MethodSelector
                        newMethod={newTransfer.toMethod}
                        handleInput={handleNewTransferInput}
                        errors={errors.to}
                        inputName="toMethod"
                    />
                    <TextField
                        label="備考"
                        value={newTransfer.description}
                        onChange={(e) => handleNewTransferInput('description', e.target.value)}
                    />
                </FormGroup>
            </Box>
            <Box gap={1} display="flex" mt={1}>
                <Button
                    sx={{ width: '50%' }}
                    variant="contained"
                    disabled={hasError}
                    onClick={addTransfer}
                >
                    追加
                </Button>
                <Button
                    sx={{ width: '50%' }}
                    variant="outlined"
                    disabled={hasError}
                    onClick={addTemplate}
                >
                    ボタン化
                </Button>
            </Box>
        </>
    );
};

export default TransferInput;
