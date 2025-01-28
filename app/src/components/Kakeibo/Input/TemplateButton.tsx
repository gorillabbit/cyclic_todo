import { Chip } from '@mui/material';
import { useCallback, useState } from 'react';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { InputFieldPurchaseType, TemplateButtonType } from '../../../types/purchaseTypes';
import { deletePurchaseTemplate } from '../../../api/deleteApi';

const TemplateButton = ({
    setNewPurchase,
    template,
    fetchTemplates,
}: {
    setNewPurchase: (value: React.SetStateAction<InputFieldPurchaseType>) => void;
    template: TemplateButtonType;
    fetchTemplates: () => Promise<void>;
}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const onClickTemplateButton = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...templatePurchaseWithoutId } = template;
        setNewPurchase({
            ...templatePurchaseWithoutId,
            date: new Date(),
            id: new Date().getTime().toString(),
        });
    }, [setNewPurchase, template]);

    const handleDeleteButtonClick = useCallback(() => {
        setOpenDialog(true);
    }, []);

    const deleteAction = useCallback(async () => {
        await deletePurchaseTemplate(template.id);
        fetchTemplates();
    }, [template.id]);

    return (
        <>
            <Chip
                sx={{ m: 0.5 }}
                onClick={onClickTemplateButton}
                onDelete={handleDeleteButtonClick}
                label={template.title}
            />
            <DeleteConfirmDialog
                target={<Chip sx={{ m: 0.5 }} label={template.title} />}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                deleteAction={deleteAction}
            />
        </>
    );
};

export default TemplateButton;
