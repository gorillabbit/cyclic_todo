import { IconButton, TableRow, Chip } from '@mui/material';
import { useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { InputPurchaseScheduleRowType, MethodListType } from '../../../../types';
import TableCellWrapper from '../../TableCellWrapper';

const NormalPurchaseScheduleRow = ({
    editFormData,
    setIsEdit,
    setOpenDialog,
    method,
}: {
    editFormData: InputPurchaseScheduleRowType;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    method: MethodListType | undefined;
}) => {
    const handleEditClick = useCallback(() => {
        setIsEdit(true);
    }, [setIsEdit]);

    const handleDeleteButton = useCallback(() => {
        setOpenDialog(true);
    }, [setOpenDialog]);

    return (
        <TableRow
            key={editFormData.id}
            sx={{
                pb: 0.5,
                borderColor: editFormData.income ? '#c5fcdc' : '#fcc9c5',
                borderRightWidth: 10,
            }}
        >
            <TableCellWrapper
                label={
                    editFormData.cycle +
                    (editFormData.date ? editFormData.date + '日' : editFormData.day)
                }
            />
            <TableCellWrapper label={editFormData.endDate.toLocaleString().split(' ')[0]} />
            <TableCellWrapper label={editFormData.title} />
            <TableCellWrapper label={editFormData.price} />
            <TableCellWrapper label={editFormData.category} />
            <TableCellWrapper label={method?.label} />
            <TableCellWrapper>{editFormData.isUncertain && <Chip label="未確" />}</TableCellWrapper>
            <TableCellWrapper label={editFormData.description} />
            <TableCellWrapper>
                <>
                    <IconButton
                        onClick={handleEditClick}
                        sx={{
                            '&:hover': {
                                color: '#1976d2',
                            },
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleDeleteButton}
                        sx={{
                            '&:hover': {
                                color: '#d32f2f',
                            },
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            </TableCellWrapper>
        </TableRow>
    );
};

export default NormalPurchaseScheduleRow;
