import { Button } from '@mui/material';
import React, { useState } from 'react';
import { addDocLogsCompleteLog } from '../../firebase';
import { LogType } from '../../types.js';
import MemoDialog from './MemoDialog';

interface LogCompleteButtonProps {
    log: LogType;
}

const logComplete = (log: LogType, memo?: string) => {
    const logsCompleteLogs = {
        logId: log.id,
        type: 'finish',
        memo: memo ?? '',
        tabId: log.tabId,
    };
    addDocLogsCompleteLog(logsCompleteLogs);
};

const LogCompleteButton: React.FC<LogCompleteButtonProps> = ({ log }) => {
    const [isOpenMemoDialog, setIsOpenMemoDialog] = useState<boolean>(false);

    const handleLogComplete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (log.availableMemo) {
            setIsOpenMemoDialog(true);
            return;
        } else {
            logComplete(log);
        }
    };

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ borderRadius: '0px' }}
                onClick={(e) => handleLogComplete(e)}
            >
                完了
            </Button>
            {log.availableMemo && (
                <MemoDialog
                    isOpen={isOpenMemoDialog}
                    setIsOpen={setIsOpenMemoDialog}
                    logComplete={logComplete}
                    log={log}
                />
            )}
        </>
    );
};

export default LogCompleteButton;
