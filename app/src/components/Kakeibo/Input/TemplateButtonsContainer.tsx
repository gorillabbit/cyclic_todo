import { Box } from '@mui/material';
import { memo, useMemo } from 'react';
import { orderBy, where } from 'firebase/firestore';
import { useFirestoreQuery } from '../../../utilities/firebaseUtilities';
import TemplateButton from './TemplateButton';
import { dbNames } from '../../../firebase';
import { useTab } from '../../../hooks/useData';
import { InputFieldPurchaseType, TemplateButtonType } from '../../../types/purchaseTypes';

type PlainTemplateButtonsContainerProps = {
    templates: TemplateButtonType[];
    setNewPurchase: (value: React.SetStateAction<InputFieldPurchaseType>) => void;
};

const PlainTemplateButtonsContainer = memo(
    ({ templates, setNewPurchase }: PlainTemplateButtonsContainerProps) => (
        <Box m={0.5}>
            {templates.map((template) => (
                <TemplateButton {...{ template, setNewPurchase }} key={template.id} />
            ))}
        </Box>
    )
);

const TemplateButtonsContainer = ({
    setNewPurchase,
}: {
    setNewPurchase: (value: React.SetStateAction<InputFieldPurchaseType>) => void;
}) => {
    const { tab_id } = useTab();
    const purchaseTemplatesQueryConstraints = useMemo(
        () => [orderBy('timestamp', 'desc'), where('tab_id', '==', tab_id)],
        [tab_id]
    );
    const { documents: templates } = useFirestoreQuery<TemplateButtonType>(
        dbNames.purchaseTemplate,
        purchaseTemplatesQueryConstraints,
        true
    );

    const plainProps = {
        templates,
        setNewPurchase,
    };
    return <PlainTemplateButtonsContainer {...plainProps} />;
};

export default TemplateButtonsContainer;
