import { Box } from '@mui/material';
import TemplateButton from './TemplateButton';
import { InputFieldPurchaseType, TemplateButtonType } from '../../../types/purchaseTypes';

const TemplateButtonsContainer = ({
    setNewPurchase,
    templateList,
}: {
    setNewPurchase: (value: React.SetStateAction<InputFieldPurchaseType>) => void;
    templateList: TemplateButtonType[];
}) => {
    return (
        <Box m={0.5}>
            {templateList.map((template) => (
                <TemplateButton {...{ template, setNewPurchase }} key={template.id} />
            ))}
        </Box>
    );
};

export default TemplateButtonsContainer;
