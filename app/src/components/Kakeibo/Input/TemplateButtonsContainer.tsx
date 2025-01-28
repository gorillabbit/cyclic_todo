import { Box } from '@mui/material';
import TemplateButton from './TemplateButton';
import { InputFieldPurchaseType, TemplateButtonType } from '../../../types/purchaseTypes';

const TemplateButtonsContainer = ({
    setNewPurchase,
    templateList,
    fetchTemplates,
}: {
    setNewPurchase: (value: React.SetStateAction<InputFieldPurchaseType>) => void;
    templateList: TemplateButtonType[];
    fetchTemplates: () => Promise<void>;
}) => {
    return (
        <Box m={0.5}>
            {templateList.map((template) => (
                <TemplateButton
                    setNewPurchase={setNewPurchase}
                    template={template}
                    key={template.id}
                    fetchTemplates={fetchTemplates}
                />
            ))}
        </Box>
    );
};

export default TemplateButtonsContainer;
