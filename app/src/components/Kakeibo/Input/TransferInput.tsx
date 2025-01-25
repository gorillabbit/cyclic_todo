import { Box, Button, FormGroup, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { memo, useCallback, useMemo, useState } from 'react';
import { addDocTransferTemplate } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import {
    MethodListType,
    InputTransferType,
    defaultTransferInput,
    ErrorType,
    TransferType,
} from '../../../types';
import { getPayDate, numericProps } from '../../../utilities/purchaseUtilities';
import TransferTemplateButtonsContainer from './TransferTemplateButtonContainer';
import { useMethod, usePurchase, useTab } from '../../../hooks/useData';
import { getHasError, validateTransfer } from '../KakeiboSchemas';
import MethodSelector from '../ScreenParts/MethodSelector';
import { createPurchase } from '../../../utilities/apiClient';

type PlainTransferInputProps = {
    handleNewTransferInput: (name: string, value: string | Date | MethodListType | null) => void;
    newTransfer: InputTransferType;
    addTransfer: () => void;
    addTemplate: () => void;
    errors: ErrorType;
    hasError: boolean;
    useTemplate: (transfer: TransferType) => void;
};

const PlainTransferInput = memo(
    ({
        handleNewTransferInput,
        newTransfer,
        addTransfer,
        addTemplate,
        errors,
        hasError,
        useTemplate,
    }: PlainTransferInputProps) => (
        <>
            <TransferTemplateButtonsContainer useTemplate={useTemplate} />
            <Box display="flex">
                <FormGroup row sx={{ gap: 1, mr: 1, width: '100%' }}>
                    <TextField
                        label="金額"
                        value={newTransfer.price}
                        inputProps={numericProps}
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
                        newMethod={newTransfer.from}
                        handleInput={handleNewTransferInput}
                        errors={errors.from}
                        inputName="from"
                    />
                    <MethodSelector
                        newMethod={newTransfer.to}
                        handleInput={handleNewTransferInput}
                        errors={errors.to}
                        inputName="to"
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
    )
);

const TransferInput = () => {
    const { currentUser } = getAuth();
    const { tab_id } = useTab();
    const { methodList } = useMethod();
    const [newTransfer, setNewTransfer] = useState<InputTransferType>({
        ...defaultTransferInput,
        tab_id,
    });
    const { fetchPurchases } = usePurchase();

    const [errors, setErrors] = useState<ErrorType>({});

    const validateAndSetErrors = useCallback((input: InputTransferType) => {
        const errors = validateTransfer(input);
        setErrors(errors);
        return getHasError(errors);
    }, []);

    const hasError = useMemo(() => getHasError(errors), [errors]);

    const handleNewTransferInput = useCallback(
        (name: string, value: string | Date | MethodListType | null) => {
            setNewTransfer((prev) => {
                const nextTransfer = { ...prev, [name]: value };
                validateAndSetErrors(nextTransfer);
                return nextTransfer;
            });
        },
        []
    );

    const addTransfer = useCallback(async () => {
        if (validateAndSetErrors(newTransfer)) {
            return console.error('エラーがあります');
        }
        if (!currentUser) {
            return console.error('ログインしていません');
        }
        const fromMethod = methodList.find((m) => m.id === newTransfer.from);
        const toMethod = methodList.find((m) => m.id === newTransfer.to);
        if (!fromMethod || !toMethod) {
            return console.error('支払い方法が見つかりません');
        }
        const { price, date, description, from, to } = newTransfer;
        const basePurchase = {
            user_id: currentUser.uid,
            category: '送受金',
            date,
            description,
            tab_id: tab_id,
            id: '',
            balance: 0,
        };
        const purchaseTitle = `${fromMethod.label}→${toMethod.label}`;
        const fromPurchase = {
            ...basePurchase,
            title: `【送】${purchaseTitle}`,
            method: from,
            pay_date: getPayDate(fromMethod, date),
            asset_id: fromMethod.asset_id,
            difference: -price,
        };

        const toPurchase = {
            ...basePurchase,
            title: `【受】${purchaseTitle}`,
            method: to,
            pay_date: getPayDate(toMethod, date),
            asset_id: toMethod.asset_id,
            difference: price,
        };

        await createPurchase(fromPurchase);
        await createPurchase(toPurchase);
        setNewTransfer(defaultTransferInput);
        fetchPurchases();
    }, [currentUser, tab_id, newTransfer]);

    const addTemplate = useCallback(() => {
        // TODO ここの処理をaddTransferと共通化できないか考える
        if (validateAndSetErrors(newTransfer)) {
            return console.error('エラーがあります');
        }
        if (!currentUser) {
            return console.error('ログインしていません');
        }
        addDocTransferTemplate({
            ...newTransfer,
            user_id: currentUser.uid,
            tab_id,
        });
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

    const plainProps = {
        handleNewTransferInput,
        newTransfer,
        addTransfer,
        addTemplate,
        errors,
        hasError,
        useTemplate,
    };
    return <PlainTransferInput {...plainProps} />;
};

export default TransferInput;
