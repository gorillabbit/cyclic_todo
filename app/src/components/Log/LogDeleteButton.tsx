import { Button } from '@mui/material';
import React from 'react';
import { LogType, LogsCompleteLogsType } from '../../types.js';
import { deleteLog, deleteLogCompleteLog } from '../../api/combinedApi.js';

interface LogDeleteButtonProps {
    log: LogType;
    completeLogs: LogsCompleteLogsType[];
}

const deleteLogAndCompleteLogs = (log: LogType, completeLogs: LogsCompleteLogsType[]) => {
    deleteLog(log.id);
    completeLogs.forEach((element) => {
        deleteLogCompleteLog(element.id);
    });
};

const LogDeleteButton: React.FC<LogDeleteButtonProps> = ({ log, completeLogs }) => {
    return (
        <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ borderRadius: '0px' }}
            onClick={() => deleteLogAndCompleteLogs(log, completeLogs)}
        >
            削除
        </Button>
    );
};

export default LogDeleteButton;
