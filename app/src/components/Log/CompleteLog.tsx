import { Box } from '@mui/material';
import { BodyTypography } from '../TypographyWrapper';
import { format } from 'date-fns';
import { LogsCompleteLogsType } from '../../types';

interface CompleteLogProps {
    completeLog: LogsCompleteLogsType;
}

const CompleteLog: React.FC<CompleteLogProps> = ({ completeLog }) => {
    return completeLog.timestamp ? (
        <BodyTypography
            text={
                format(completeLog.timestamp, 'yyyy-MM-dd HH:mm') +
                ' ' +
                (completeLog.memo ? completeLog.memo : '')
            }
        />
    ) : (
        <Box />
    );
};

export default CompleteLog;
