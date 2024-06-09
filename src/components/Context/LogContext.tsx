import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy, where } from "firebase/firestore";
import { InputLogType, LogType, LogsCompleteLogsType } from "../../types.js";
import { useAccount } from "./AccountContext";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { useTab } from "./TabContext";

type LogContextType = {
  logList: LogType[];
  logsCompleteLogsList: LogsCompleteLogsType[];
  sharedLogList: LogType[];
};

// Contextを作成（初期値は空のlogListとダミーのsetLogList関数）
export const LogContext = createContext<LogContextType>({
  logList: [],
  logsCompleteLogsList: [],
  sharedLogList: [],
});

export const LogProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const { Account } = useAccount();
    const { tabId } = useTab();

    const logQueryConstraints = useMemo(
      () => [where("tabId", "==", tabId)],
      [tabId]
    );
    const { documents: logList } = useFirestoreQuery<LogType>(
      "logs",
      logQueryConstraints
    );

    const logsCompleteLogsQueryConstraints = useMemo(
      () => [orderBy("timestamp", "desc"), where("tabId", "==", tabId)],
      [tabId]
    );
    const { documents: logsCompleteLogsList } =
      useFirestoreQuery<LogsCompleteLogsType>(
        "logsCompleteLogs",
        logsCompleteLogsQueryConstraints,
        true
      );

    const sharedLogsQueryConstraints = useMemo(
      () => [
        where(
          "accessibleAccountsEmails",
          "array-contains",
          Account?.email ?? ""
        ),
        where("tabId", "==", tabId),
        where("userId", "!=", Account?.id ?? ""),
      ],
      [Account?.email, Account?.id, tabId]
    );
    const { documents: sharedLogList } = useFirestoreQuery<
      InputLogType,
      LogType
    >("logs", sharedLogsQueryConstraints, true);

    const context = useMemo(() => {
      return { logList, logsCompleteLogsList, sharedLogList };
    }, [logList, logsCompleteLogsList, sharedLogList]);

    return (
      <LogContext.Provider value={context}>{children}</LogContext.Provider>
    );
  }
);

export const useLog = () => useContext(LogContext);
