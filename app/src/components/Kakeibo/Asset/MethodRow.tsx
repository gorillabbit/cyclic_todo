import {
    TableRow,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputAdornment,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { MethodListType } from '../../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { numericProps, sumSpentAndIncome } from '../../../utilities/purchaseUtilities';
import { useMethod, usePurchase } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';
import { getFutureMonthFirstDay, getThisMonthFirstDay } from '../../../utilities/dateUtilities';
import { updateMethod } from '../../../api/updateApi';
import { deleteMethod } from '../../../api/deleteApi';

const MethodRow = ({ method }: { method: MethodListType }) => {
    const { fetchMethod } = useMethod();
    const [methodInput, setMethodInput] = useState<MethodListType>(method);

    const handleMethodInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setMethodInput((prev) => {
                const newMethod = { ...prev, [name]: value };
                return newMethod;
            });
        },
        []
    );

    const handleSelectInput = useCallback((e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setMethodInput((prev) => ({ ...prev, [name]: value }));
    }, []);

    const saveChanges = useCallback(async () => {
        await updateMethod(method.id, methodInput);
        fetchMethod();
    }, [method, methodInput]);

    const removeMethod = useCallback(async () => {
        await deleteMethod(method.id);
        fetchMethod();
    }, [method.id]);

    const isChanged = useMemo(
        () => method.label !== methodInput.label || method.timing !== methodInput.timing,
        [method, methodInput]
    );

    const { purchaseList } = usePurchase();
    const methodPurchase = purchaseList.filter((p) => p.method === method.id);
    const thisMonthPurchase = methodPurchase.filter(
        (p) => getFutureMonthFirstDay() > p.date && p.date >= getThisMonthFirstDay()
    );
    const thisMonthSpent = sumSpentAndIncome(thisMonthPurchase.filter((p) => p.difference < 0));
    const thisMonthIncome = sumSpentAndIncome(thisMonthPurchase.filter((p) => p.difference > 0));

    return (
        <TableRow>
            <TableCellWrapper>
                <TextField
                    variant="outlined"
                    value={methodInput.label}
                    name="label"
                    onChange={handleMethodInput}
                    size="small"
                />
            </TableCellWrapper>
            <TableCellWrapper label={thisMonthIncome} />
            <TableCellWrapper label={-thisMonthSpent} />
            <TableCellWrapper>
                <Select
                    value={methodInput.timing}
                    name="timing"
                    onChange={handleSelectInput}
                    size="small"
                >
                    <MenuItem value="即時">即時</MenuItem>
                    <MenuItem value="翌月">翌月</MenuItem>
                </Select>
                {methodInput.timing === '翌月' && (
                    <TextField
                        name="timingDate"
                        value={methodInput.timingDate}
                        InputProps={{
                            endAdornment: <InputAdornment position="start">日</InputAdornment>,
                        }}
                        inputProps={numericProps}
                        sx={{ maxWidth: 70, marginLeft: 1 }}
                        onChange={handleMethodInput}
                        size="small"
                    />
                )}
            </TableCellWrapper>
            <TableCellWrapper>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!isChanged}
                    onClick={saveChanges}
                >
                    変更
                </Button>
            </TableCellWrapper>
            <TableCellWrapper>
                <IconButton onClick={removeMethod} color="error">
                    <DeleteIcon />
                </IconButton>
            </TableCellWrapper>
        </TableRow>
    );
};

export default MethodRow;
