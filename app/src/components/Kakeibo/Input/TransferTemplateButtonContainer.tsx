import { Box } from '@mui/material';
import { TransferType } from '../../../types';
import TransferTemplateButton from './TransferTemplateButton';

const TransferTemplateButtonsContainer = ({
    useTemplate,
    transferList,
}: {
    useTemplate: (transfer: TransferType) => void;
    transferList: TransferType[];
}) => {
    return (
        <Box m={0.5}>
            {transferList.map((transfer) => (
                <TransferTemplateButton
                    transfer={transfer}
                    useTemplate={useTemplate}
                    key={transfer.id}
                />
            ))}
        </Box>
    );
};

export default TransferTemplateButtonsContainer;
