import { IconButton, Button, Box } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from '../../DeleteConfirmDialog';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import { deletePurchase } from '../../../../utilities/apiClient';
import { usePurchase } from '../../../../hooks/useData';

type PlainPurchaseRowButtonsProps = {
    purchase: PurchaseDataType;
    handleEditClick: () => void;
    handleDeleteButton: () => void;
    handleEditPriceButtonClick: () => void;
    is_uncertain: boolean | undefined;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    deleteAction: () => void;
};

const PlainPurchaseRowButtons = memo(
    ({
        purchase,
        handleEditClick,
        handleDeleteButton,
        handleEditPriceButtonClick,
        is_uncertain,
        openDialog,
        setOpenDialog,
        deleteAction,
    }: PlainPurchaseRowButtonsProps) => (
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
            {is_uncertain && (
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
    )
);

const PurchaseRowButtons = ({
    purchase,
    setIsEdit,
    setIsEditPrice,
    is_uncertain,
}: {
    purchase: PurchaseDataType;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
    is_uncertain: boolean | undefined;
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

    const plainProps = {
        purchase,
        handleEditClick,
        handleDeleteButton,
        is_uncertain,
        handleEditPriceButtonClick,
        openDialog,
        setOpenDialog,
        deleteAction,
    };
    return <PlainPurchaseRowButtons {...plainProps} />;
};

export default PurchaseRowButtons;
