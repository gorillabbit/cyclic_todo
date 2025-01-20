import { IconButton, Button, Box } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from '../../DeleteConfirmDialog';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import {
    deletePurchaseAndUpdateLater,
    updateAndAddPurchases,
} from '../../../../utilities/purchaseUtilities';
import { usePurchase } from '../../../../hooks/useData';

type PlainPurchaseRowButtonsProps = {
    purchase: PurchaseDataType;
    handleEditClick: () => void;
    handleDeleteButton: () => void;
    handleEditPriceButtonClick: () => void;
    isUncertain: boolean | undefined;
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
        isUncertain,
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
            {isUncertain && (
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
    isUncertain,
    updatePurchases,
}: {
    purchase: PurchaseDataType;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
    isUncertain: boolean | undefined;
    updatePurchases: PurchaseDataType[];
}) => {
    const { setPurchaseList } = usePurchase();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const handleEditClick = useCallback(() => {
        setIsEdit(true);
    }, [setIsEdit]);

    const handleDeleteButton = useCallback(() => {
        setOpenDialog(true);
    }, [setOpenDialog]);

    const handleEditPriceButtonClick = useCallback(
        () => setIsEditPrice(true),
        [setIsEditPrice]
    );

    const deleteAction = useCallback(async () => {
        let updates = updatePurchases;
        updates = await deletePurchaseAndUpdateLater(purchase.id, updates);
        updateAndAddPurchases(updates);
        setPurchaseList(updates);
    }, [purchase.id, setPurchaseList, updatePurchases]);

    const plainProps = {
        purchase,
        handleEditClick,
        handleDeleteButton,
        isUncertain,
        handleEditPriceButtonClick,
        openDialog,
        setOpenDialog,
        deleteAction,
    };
    return <PlainPurchaseRowButtons {...plainProps} />;
};

export default PurchaseRowButtons;
