import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../../firebase.js";
import {
  orderBy,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { LogType, LogsCompleteLogsType } from "../../types.js";
import { getAuth } from "firebase/auth";

interface LogContextProp {
  children: any;
}

type LogContextType = {
  logList: LogType[];
  setLogList: React.Dispatch<React.SetStateAction<LogType[]>>;
  logsCompleteLogsList: LogsCompleteLogsType[];
  setLogsCompleteLogsList: React.Dispatch<
    React.SetStateAction<LogsCompleteLogsType[]>
  >;
};

// Contextを作成（初期値は空のlogListとダミーのsetLogList関数）
export const LogContext = createContext<LogContextType>({
  logList: [],
  setLogList: () => {},
  logsCompleteLogsList: [],
  setLogsCompleteLogsList: () => {},
});

export const LogProvider: React.FC<LogContextProp> = ({ children }) => {
  const [logList, setLogList] = useState<LogType[]>([]);
  const [logsCompleteLogsList, setLogsCompleteLogsList] = useState<
    LogsCompleteLogsType[]
  >([]);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    //Logの取得
    const fetchLogs = () => {
      const logQuery = query(
        collection(db, "logs"),
        where("userId", "==", auth.currentUser?.uid)
      );
      return onSnapshot(logQuery, (querySnapshot) => {
        const LogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as LogType),
        }));
        setLogList(LogsData);
      });
    };

    const fetchLogsCompleteLogs = () => {
      const logsCompleteLogsQuery = query(
        collection(db, "logsCompleteLogs"),
        orderBy("timestamp", "desc")
      );
      return onSnapshot(logsCompleteLogsQuery, (querySnapshot) => {
        const logsCompleteLogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as LogsCompleteLogsType),
        }));
        setLogsCompleteLogsList(logsCompleteLogsData);
      });
    };

    const unsubscribeLog = fetchLogs();
    const unsubscribeLogsCompleteLogs = fetchLogsCompleteLogs();

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeLog();
      unsubscribeLogsCompleteLogs();
    };
  }, [auth.currentUser]);

  return (
    <LogContext.Provider
      value={{
        logList,
        setLogList,
        logsCompleteLogsList,
        setLogsCompleteLogsList,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => useContext(LogContext);
