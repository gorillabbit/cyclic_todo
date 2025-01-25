import { IconButton, TableRow, Chip } from '@mui/material';
import { memo, useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { InputPurchaseScheduleRowType } from '../../../../types';
import TableCellWrapper from '../../TableCellWrapper';

type PlainNormalPurchaseScheduleRowProps = {
    editFormData: InputPurchaseScheduleRowType;
    handleEditClick: () => void;
    handleDeleteButton: () => void;
};

const PlainNormalPurchaseScheduleRow = memo(
    ({
        editFormData,
        handleEditClick,
        handleDeleteButton,
    }: PlainNormalPurchaseScheduleRowProps) => (
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
            <TableCellWrapper label={editFormData.method} />
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
    )
);

const NormalPurchaseScheduleRow = ({
    editFormData,
    isSmall,
    setIsEdit,
    setOpenDialog,
}: {
    editFormData: InputPurchaseScheduleRowType;
    isSmall: boolean;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleEditClick = useCallback(() => {
        setIsEdit(true);
    }, [setIsEdit]);

    const handleDeleteButton = useCallback(() => {
        setOpenDialog(true);
    }, [setOpenDialog]);

    const plainProps = {
        editFormData,
        isSmall,
        handleEditClick,
        handleDeleteButton,
    };
    return <PlainNormalPurchaseScheduleRow {...plainProps} />;
};

export default NormalPurchaseScheduleRow;
