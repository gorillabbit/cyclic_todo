import { IconButton, Button, Box } from '@mui/material';
import { useCallback, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from '../../DeleteConfirmDialog';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import { usePurchase } from '../../../../hooks/useData';
import { deletePurchase } from '../../../../api/combinedApi';

const PurchaseRowButtons = ({
    purchase,
    setIsEdit,
    setIsEditPrice,
    isUncertain,
}: {
    purchase: PurchaseDataType;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
    isUncertain: boolean | undefined;
}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const { fetchPurchases } = usePurchase();
    const handleEditClick = useCallback(() => {
        setIsEdit(true);
    }, [setIsEdit]);

    const handleDeleteButton = useCallback(() => {
        setOpenDialog(true);
    }, [setOpenDialog]);

    const handleEditPriceButtonClick = useCallback(() => setIsEditPrice(true), [setIsEditPrice]);

    const deleteAction = useCallback(async () => {
        await deletePurchase(purchase.id);
        fetchPurchases();
    }, [purchase.id]);

    return (
        <Box display="flex">
            <IconButton
                onClick={handleEditClick}
                sx={{
                    '&:hover': {
                        color: '#1976d2',
                    },
                    p: 0.5,
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
                    p: 0.5,
                }}
            >
                <DeleteIcon />
            </IconButton>
            {Boolean(isUncertain) && (
                <Button sx={{ p: 0.5 }} onClick={handleEditPriceButtonClick}>
                    金額確定
                </Button>
            )}
            <DeleteConfirmDialog
                target={purchase.title}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                deleteAction={deleteAction}
            />
        </Box>
    );
};

export default PurchaseRowButtons;
