import { Masonry } from '@mui/lab';
import { Button } from '@mui/material'; // MUIのButtonをインポート
import Log from './Log';
import { useState } from 'react';
import { useLog } from '../../hooks/useData';

const LogList = () => {
    const { logList, logsCompleteLogsList, sharedLogList } = useLog();
    const mergerLogList = [...logList, ...sharedLogList];
    const [showArchived, setShowArchived] = useState(false); // archivedログの表示状態を管理

    return (
        <>
            <Masonry
                sx={{ margin: '2px' }}
                columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
            >
                {logList
                    .filter((log) => log.archived !== true)
                    .map((log) => (
                        <Log
                            log={log}
                            logsCompleteLogs={logsCompleteLogsList}
                            key={log.id}
                        />
                    ))}
                {sharedLogList
                    .filter((log) => log.archived !== true)
                    .map((log) => (
                        <Log
                            log={log}
                            logsCompleteLogs={logsCompleteLogsList}
                            key={log.id}
                        />
                    ))}
            </Masonry>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowArchived(!showArchived)}
                sx={{ marginY: 2 }}
            >
                {showArchived
                    ? 'アーカイブログを非表示'
                    : 'アーカイブログを表示'}
            </Button>
            {showArchived && ( // 状態変数に応じてarchivedログのリストを表示
                <Masonry
                    sx={{ margin: '2px' }}
                    columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                >
                    {mergerLogList
                        .filter((log) => log.archived === true)
                        .map((log) => (
                            <Log
                                log={log}
                                logsCompleteLogs={logsCompleteLogsList}
                                key={log.id}
                            />
                        ))}
                </Masonry>
            )}
        </>
    );
};

export default LogList;
