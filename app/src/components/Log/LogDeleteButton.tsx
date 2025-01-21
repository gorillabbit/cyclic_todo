import { Button } from '@mui/material';
import React from 'react';
import { deleteDocLog, deleteDocLogsCompleteLog } from '../../firebase';
import { LogType, LogsCompleteLogsType } from '../../types.js';

interface LogDeleteButtonProps {
    log: LogType;
    completeLogs: LogsCompleteLogsType[];
}

const deleteLog = (log: LogType, completeLogs: LogsCompleteLogsType[]) => {
    deleteDocLog(log.id);
    completeLogs.forEach((element) => {
        deleteDocLogsCompleteLog(element.id);
    });
};

const LogDeleteButton: React.FC<LogDeleteButtonProps> = ({ log, completeLogs }) => {
    return (
        <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ borderRadius: '0px' }}
            onClick={() => deleteLog(log, completeLogs)}
        >
            削除
        </Button>
    );
};

export default LogDeleteButton;
