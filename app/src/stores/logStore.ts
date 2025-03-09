import { create } from 'zustand';
import { LogType, LogsCompleteLogsType } from '../types.js';
import { getLog, getLogCompleteLog } from '../api/combinedApi.js';

type LogState = {
    logList: LogType[];
    logsCompleteLogsList: LogsCompleteLogsType[];
    sharedLogList: LogType[];
    fetchLogs: (tabId: string, accountId: string) => Promise<void>;
};

export const useLogStore = create<LogState>((set) => ({
    logList: [],
    logsCompleteLogsList: [],
    sharedLogList: [],
    fetchLogs: async (tabId, accountId): Promise<void> => {
        const data = await getLog({ userId:accountId, tabId });
        console.log(data);
        set({ logList: data });

        const logCompleteLogData = await getLogCompleteLog({ tabId });
        set({ logsCompleteLogsList: logCompleteLogData });

        const sharedLogs = await getLog({ tabId });
        set({ sharedLogList: sharedLogs });
    },
}));
