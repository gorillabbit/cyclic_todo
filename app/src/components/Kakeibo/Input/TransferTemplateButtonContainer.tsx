import { Box } from '@mui/material';
import { TransferType } from '../../../types';
import TransferTemplateButton from './TransferTemplateButton';

const TransferTemplateButtonsContainer = ({
    useTemplate,
    transferList,
    fetchTemplates,
}: {
    useTemplate: (transfer: TransferType) => void;
    transferList: TransferType[];
    fetchTemplates: () => void;
}) => {
    return (
        <Box m={0.5}>
            {transferList.map((transfer) => (
                <TransferTemplateButton
                    transfer={transfer}
                    useTemplate={useTemplate}
                    key={transfer.id}
                    fetchTemplates={fetchTemplates}
                />
            ))}
        </Box>
    );
};

export default TransferTemplateButtonsContainer;
