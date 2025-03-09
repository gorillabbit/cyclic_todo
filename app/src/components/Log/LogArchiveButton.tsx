import { Button } from '@mui/material';
import React from 'react';
import { LogType } from '../../types.js';
import { updateLog } from '../../api/combinedApi.js';

interface LogDeleteButtonProps {
    log: LogType;
}

const archiveLog = (log: LogType, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    updateLog(log.id, { archived: !log.archived });
};

const LogArchiveButton: React.FC<LogDeleteButtonProps> = ({ log }) => {
    return (
        <Button
            fullWidth
            variant="contained"
            color="warning"
            sx={{ borderRadius: '0px' }}
            onClick={(e) => archiveLog(log, e)}
        >
            {log.archived ? '有効化' : '無効化'}
        </Button>
    );
};

export default LogArchiveButton;
