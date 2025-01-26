import { Box, Button, FormGroup, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import StyledCheckbox from '../../StyledCheckbox';
import { useState, useCallback, useMemo } from 'react';
import { ErrorType, InputPurchaseScheduleType, MethodListType } from '../../../types';
import { addYears } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
import { addScheduledPurchase, weekDaysString } from '../../../utilities/purchaseUtilities';
import { useAccount, usePurchase, useTab } from '../../../hooks/useData';
import { getHasError, validatePurchaseSchedule } from '../KakeiboSchemas';
import MethodSelector from '../ScreenParts/MethodSelector';
import CategorySelector from '../ScreenParts/CategorySelector';
import { createPurchaseSchedule } from '../../../api/createApi';

const defaultNewPurchase: InputPurchaseScheduleType = {
    userId: '',
    title: '',
    cycle: '毎月',
    date: 1,
    day: '月曜日',
    category: '',
    method: '',
    price: 0,
    income: false,
    description: '',
    endDate: addYears(new Date(), 1),
    isUncertain: false,
    tabId: '',
};

const PurchaseScheduleInput = () => {
    const { tabId } = useTab();

    const [newPurchaseSchedule, setNewPurchaseSchedule] = useState<InputPurchaseScheduleType>({
        ...defaultNewPurchase,
        tabId,
    });

    const [errors, setErrors] = useState<ErrorType>({});

    const validateAndSetErrors = useCallback((input: InputPurchaseScheduleType) => {
        const errors = validatePurchaseSchedule(input);
        setErrors(errors);
        return getHasError(errors);
    }, []);

    const hasError = useMemo(() => getHasError(errors), [errors]);

    const handleNewPurchaseScheduleInput = useCallback(
        (name: string, value: string | Date | boolean | MethodListType | null) => {
            setNewPurchaseSchedule((prev) => {
                const nextPurchase = { ...prev, [name]: value };
                validateAndSetErrors(nextPurchase);
                return nextPurchase;
            });
        },
        []
    );

    const { Account } = useAccount();
    const { fetchPurchases } = usePurchase();
    const addPurchaseSchedule = useCallback(async () => {
        const isError = validateAndSetErrors(newPurchaseSchedule);
        if (isError) {
            return;
        }
        if (!Account) {
            return console.error('ログインしてください');
        }

        const addedSchedule = await createPurchaseSchedule({
            ...newPurchaseSchedule,
            userId: Account.id,
        });
        await addScheduledPurchase(addedSchedule.id, newPurchaseSchedule);
        setNewPurchaseSchedule(defaultNewPurchase);
        fetchPurchases();
    }, [newPurchaseSchedule]);

    return (
        <>
            <Box display="flex">
                <FormGroup row sx={{ gap: 1, mr: 1, width: '100%' }}>
                    <TextField
                        label="品目"
                        value={newPurchaseSchedule.title}
                        onChange={(e) => handleNewPurchaseScheduleInput('title', e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        label="金額"
                        value={newPurchaseSchedule.price}
                        onChange={(e) => handleNewPurchaseScheduleInput('price', e.target.value)}
                        error={!!errors.price}
                        helperText={errors.price}
                    />
                    <Select
                        value={newPurchaseSchedule.cycle}
                        sx={{ maxHeight: '56px' }}
                        onChange={(e) => handleNewPurchaseScheduleInput('cycle', e.target.value)}
                    >
                        <MenuItem value="毎月">毎月</MenuItem>
                        <MenuItem value="毎週">毎週</MenuItem>
                    </Select>
                    {newPurchaseSchedule.cycle === '毎月' && (
                        <TextField
                            label="日付"
                            value={newPurchaseSchedule.date}
                            InputProps={{
                                endAdornment: <InputAdornment position="start">日</InputAdornment>,
                            }}
                            sx={{ maxWidth: 150 }}
                            onChange={(e) => handleNewPurchaseScheduleInput('date', e.target.value)}
                            error={!!errors.date}
                            helperText={errors.date}
                        />
                    )}
                    {newPurchaseSchedule.cycle === '毎週' && (
                        <Select
                            value={newPurchaseSchedule.day}
                            onChange={(e) => handleNewPurchaseScheduleInput('day', e.target.value)}
                        >
                            {weekDaysString.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {day}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                    <DatePicker
                        label="期日"
                        value={newPurchaseSchedule.endDate}
                        sx={{ maxWidth: 150 }}
                        onChange={(value) => handleNewPurchaseScheduleInput('endDate', value)}
                    />
                    <CategorySelector
                        newCategory={newPurchaseSchedule.category}
                        handleInput={handleNewPurchaseScheduleInput}
                    />
                    <MethodSelector
                        newMethod={newPurchaseSchedule.method}
                        handleInput={handleNewPurchaseScheduleInput}
                        errors={errors.method}
                    />
                    <StyledCheckbox
                        value={newPurchaseSchedule.income}
                        handleCheckbox={() =>
                            handleNewPurchaseScheduleInput('income', !newPurchaseSchedule.income)
                        }
                    >
                        収入
                    </StyledCheckbox>
                    <StyledCheckbox
                        value={newPurchaseSchedule.isUncertain}
                        handleCheckbox={() =>
                            handleNewPurchaseScheduleInput(
                                'isUncertain',
                                !newPurchaseSchedule.isUncertain
                            )
                        }
                    >
                        未確定
                    </StyledCheckbox>
                    <TextField
                        label="備考"
                        multiline
                        value={newPurchaseSchedule.description}
                        onChange={(e) =>
                            handleNewPurchaseScheduleInput('description', e.target.value)
                        }
                    />
                </FormGroup>
            </Box>
            <Button
                variant="contained"
                onClick={addPurchaseSchedule}
                sx={{ width: '100%', mt: 1 }}
                disabled={hasError}
            >
                追加
            </Button>
        </>
    );
};

export default PurchaseScheduleInput;
