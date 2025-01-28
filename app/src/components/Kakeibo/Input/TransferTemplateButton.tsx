import { Chip } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { TransferType } from '../../../types';
import { deleteDocTransferTemplate } from '../../../firebase';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { useMethod } from '../../../hooks/useData';

type PlainTransferTemplateButtonProps = {
    onClickTransferTemplateButton: () => void;
    handleDeleteButtonClick: () => void;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    deleteAction: () => void;
    chipTitle: string;
};

const PlainTransferTemplateButton = memo(
    ({
        onClickTransferTemplateButton,
        handleDeleteButtonClick,
        openDialog,
        setOpenDialog,
        deleteAction,
        chipTitle,
    }: PlainTransferTemplateButtonProps) => (
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
    )
);

const TransferTemplateButton = ({
    transfer,
    useTemplate,
}: {
    transfer: TransferType;
    useTemplate: (transfer: TransferType) => void;
}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const onClickTransferTemplateButton = useCallback(() => {
        useTemplate(transfer);
    }, [transfer]);

    const handleDeleteButtonClick = useCallback(() => {
        setOpenDialog(true);
    }, []);

    const deleteAction = useCallback(() => {
        deleteDocTransferTemplate(transfer.id);
    }, [transfer.id]);

    const { methodList } = useMethod();
    const fromMethod = methodList.find((m) => m.id === transfer.fromMethod);
    const toMethod = methodList.find((m) => m.id === transfer.toMethod);

    const chipTitle = `${fromMethod?.label}→${toMethod?.label}：${transfer.price}円`;

    const plainProps = {
        onClickTransferTemplateButton,
        handleDeleteButtonClick,
        openDialog,
        setOpenDialog,
        deleteAction,
        chipTitle,
    };
    return <PlainTransferTemplateButton {...plainProps} />;
};

export default TransferTemplateButton;
