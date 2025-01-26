import {
    TableCell,
    TextField,
    IconButton,
    TableRow,
    InputAdornment,
    MenuItem,
    Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useCallback } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { InputPurchaseScheduleRowType, MethodListType } from '../../../../types';
import {
    addScheduledPurchase,
    deleteScheduledPurchases,
    numericProps,
    weekDaysString,
} from '../../../../utilities/purchaseUtilities';
import { usePurchase } from '../../../../hooks/useData';
import TableCellWrapper from '../../TableCellWrapper';
import MethodSelector from '../../ScreenParts/MethodSelector';
import CategorySelector from '../../ScreenParts/CategorySelector';
import { updatePurchaseSchedule } from '../../../../api/updateApi';

const EditPurchaseScheduleRow = ({
    setIsEdit,
    editFormData,
    setEditFormData,
    isSmall,
}: {
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    editFormData: InputPurchaseScheduleRowType;
    setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseScheduleRowType>>;
    isSmall: boolean;
}) => {
    const { purchaseList, setPurchaseList, fetchPurchases } = usePurchase();

    // 編集内容を保存する関数
    const handleSaveClick = useCallback(async () => {
        const { id, ...editFormDataWithoutId } = editFormData;
        // アップデートし、編集を閉じる
        updatePurchaseSchedule(id, editFormData);
        // まず子タスクをすべて削除し、その後で新たな予定タスクを追加する
        await deleteScheduledPurchases(editFormData.id);
        // idが含まれると、子タスクのidがそれになってしまう

        addScheduledPurchase(id, editFormDataWithoutId);
        fetchPurchases();
    }, [editFormData, purchaseList, setIsEdit, setPurchaseList]);

    const handleEditFormChange = useCallback(
        (event: { target: { name: string; value: unknown } }) => {
            const { name, value } = event.target;
            setEditFormData((prev) => ({ ...prev, [name]: value }));
        },
        [setEditFormData]
    );

    const handleDateFormChange = useCallback(
        (value: Date | null | undefined) => {
            setEditFormData((prev) => ({
                ...prev,
                endDate: value ?? new Date(),
            }));
        },
        [setEditFormData]
    );

    const handleMethodChange = useCallback(
        (name: string, value: string | MethodListType | null) => {
            if (value && typeof value !== 'string') {
                setEditFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        },
        [setEditFormData]
    );

    const handleAutocompleteChange = useCallback(
        (name: string, value: unknown) => {
            setEditFormData((prev) => ({ ...prev, [name]: value }));
        },
        [setEditFormData]
    );

    return (
        <>
            <TableRow>
                <TableCell sx={{ px: 0.5, display: 'flex', gap: 1 }}>
                    <Select
                        size="small"
                        name="cycle"
                        value={editFormData.cycle}
                        onChange={handleEditFormChange}
                    >
                        <MenuItem value="毎月">毎月</MenuItem>
                        <MenuItem value="毎週">毎週</MenuItem>
                    </Select>
                    {editFormData.cycle === '毎月' && (
                        <TextField
                            label="日付"
                            name="date"
                            size="small"
                            value={editFormData.date}
                            InputProps={{
                                endAdornment: <InputAdornment position="start">日</InputAdornment>,
                            }}
                            inputProps={numericProps}
                            sx={{ maxWidth: 150 }}
                            onChange={handleEditFormChange}
                        />
                    )}
                    {editFormData.cycle === '毎週' && (
                        <Select
                            name="day"
                            size="small"
                            value={editFormData.day}
                            onChange={handleEditFormChange}
                        >
                            {weekDaysString.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {day}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                </TableCell>
                <TableCellWrapper>
                    <DatePicker
                        name="endDate"
                        value={editFormData.endDate}
                        onChange={handleDateFormChange}
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ maxWidth: 190 }}
                    />
                </TableCellWrapper>
                <TableCellWrapper>
                    <TextField
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                        size="small"
                    />
                </TableCellWrapper>
                <TableCellWrapper>
                    <TextField
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        size="small"
                    />
                </TableCellWrapper>
                {!isSmall && (
                    <>
                        <TableCellWrapper>
                            <CategorySelector
                                newCategory={editFormData.category}
                                handleInput={handleAutocompleteChange}
                                isSmall
                            />
                        </TableCellWrapper>
                        <TableCellWrapper>
                            <MethodSelector
                                newMethod={editFormData.method}
                                handleInput={handleMethodChange}
                                errors={undefined}
                                isSmall
                            />
                        </TableCellWrapper>
                        <TableCellWrapper>
                            <TextField
                                name="income"
                                value={editFormData.income ? '収入' : '支出'}
                                onChange={handleEditFormChange}
                                size="small"
                            />
                        </TableCellWrapper>
                        <TableCellWrapper>
                            <TextField
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditFormChange}
                                size="small"
                            />
                        </TableCellWrapper>
                    </>
                )}
                <TableCell padding="none">
                    <IconButton onClick={handleSaveClick} color="success">
                        <DoneIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            {isSmall && (
                <>
                    <TableRow>
                        <TableCellWrapper>
                            <CategorySelector
                                newCategory={editFormData.category}
                                handleInput={handleAutocompleteChange}
                                isSmall
                            />
                        </TableCellWrapper>
                        <TableCellWrapper>
                            <MethodSelector
                                newMethod={editFormData.method}
                                handleInput={handleMethodChange}
                                errors={undefined}
                                isSmall
                            />
                        </TableCellWrapper>
                        <TableCellWrapper>
                            <TextField
                                name="income"
                                value={editFormData.income ? '収入' : '支出'}
                                onChange={handleEditFormChange}
                                size="small"
                            />
                        </TableCellWrapper>
                        {!isSmall && (
                            <TableCellWrapper>
                                <TextField
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    size="small"
                                />
                            </TableCellWrapper>
                        )}
                        <TableCell padding="none">
                            <IconButton onClick={handleSaveClick} color="success">
                                <DoneIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </>
            )}
        </>
    );
};

export default EditPurchaseScheduleRow;
