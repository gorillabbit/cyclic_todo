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
import { useAccount } from "./AccountContext";

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
  sharedLogList: LogType[];
};

// Contextを作成（初期値は空のlogListとダミーのsetLogList関数）
export const LogContext = createContext<LogContextType>({
  logList: [],
  setLogList: () => {},
  logsCompleteLogsList: [],
  setLogsCompleteLogsList: () => {},
  sharedLogList: [],
});

export const LogProvider: React.FC<LogContextProp> = ({ children }) => {
  const [logList, setLogList] = useState<LogType[]>([]);
  const [logsCompleteLogsList, setLogsCompleteLogsList] = useState<
    LogsCompleteLogsType[]
  >([]);
  const auth = getAuth();
  const { Account } = useAccount();
  const [sharedLogList, setSharedLogList] = useState<LogType[]>([]);

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

  useEffect(() => {
    if (!Account) {
      return;
    }
    //共有されたLogの取得
    const fetchSharedLogs = () => {
      const logQuery = query(
        collection(db, "logs"),
        where("userId", "!=", auth.currentUser?.uid),
        where("accessibleAccountsEmails", "array-contains", Account.email)
      );
      return onSnapshot(logQuery, (querySnapshot) => {
        const LogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as LogType),
        }));
        setSharedLogList(LogsData);
      });
    };
    const unsubscribeSharedLogs = fetchSharedLogs();

    return () => unsubscribeSharedLogs();
  }, [Account, auth.currentUser?.uid]);

  return (
    <LogContext.Provider
      value={{
        logList,
        setLogList,
        logsCompleteLogsList,
        setLogsCompleteLogsList,
        sharedLogList,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => useContext(LogContext);
