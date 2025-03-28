import { Button } from '@mui/material';
import React from 'react';
import { LogType } from '../../types.js';
import { createLogCompleteLog } from '../../api/combinedApi.js';

interface LogStartButtonProps {
    log: LogType;
}

const logStart = (log: LogType, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    const logsCompleteLogs = {
        id: new Date().getTime().toString(),
        logId: log.id,
        type: 'start',
        memo: '',
        tabId: log.tabId,
    };
    createLogCompleteLog(logsCompleteLogs);
};

const LogStartButton: React.FC<LogStartButtonProps> = ({ log }) => {
    return (
        <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: '0px' }}
            onClick={(event) => logStart(log, event)}
        >
            開始
        </Button>
    );
};

export default LogStartButton;
