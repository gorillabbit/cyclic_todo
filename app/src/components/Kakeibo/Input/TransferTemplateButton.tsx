import { Chip } from '@mui/material';
import { useCallback, useState } from 'react';
import { TransferType } from '../../../types';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { useMethod } from '../../../hooks/useData';
import { deleteTransferTemplate } from '../../../api/combinedApi';

const TransferTemplateButton = ({
    transfer,
    useTemplate,
    fetchTemplates,
}: {
    transfer: TransferType;
    useTemplate: (transfer: TransferType) => void;
    fetchTemplates: () => void;
}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const onClickTransferTemplateButton = useCallback(() => {
        useTemplate(transfer);
    }, [transfer]);

    const handleDeleteButtonClick = useCallback(() => {
        setOpenDialog(true);
    }, []);

    const deleteAction = useCallback(async () => {
        await deleteTransferTemplate(transfer.id);
        fetchTemplates();
    }, [transfer.id]);

    const { methodList } = useMethod();
    const fromMethod = methodList.find((m) => m.id === transfer.fromMethod);
    const toMethod = methodList.find((m) => m.id === transfer.toMethod);

    const chipTitle = `${fromMethod?.label}→${toMethod?.label}：${transfer.price}円`;

    return (
        <>
            <Chip
                sx={{ m: 0.5 }}
                onClick={onClickTransferTemplateButton}
                onDelete={handleDeleteButtonClick}
                label={chipTitle}
            />
            <DeleteConfirmDialog
                target={<Chip sx={{ m: 0.5 }} label={chipTitle} />}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                deleteAction={deleteAction}
            />
        </>
    );
};

export default TransferTemplateButton;
