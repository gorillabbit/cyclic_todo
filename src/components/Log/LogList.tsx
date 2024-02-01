import { Masonry } from "@mui/lab";
import Log from "./Log";
import React, { useState, useEffect } from "react";
import { db } from "../../firebase.js";
import { orderBy, collection, onSnapshot, query } from "firebase/firestore";
import { LogType, LogsCompleteLogsType } from "../../types.js";

const LogList = () => {
  const [logList, setLogList] = useState<LogType[]>([]);
  const [logsCompleteLogsList, setLogsCompleteLogsList] = useState<
    LogsCompleteLogsType[]
  >([]);

  useEffect(() => {
    //Logの取得
    const fetchLogs = () => {
      const logQuery = query(collection(db, "logs"));
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
  }, []);
  return (
    <Masonry
      sx={{ margin: "2px" }}
      columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
    >
      {logList.map((log) => (
        <Log log={log} logsCompleteLogs={logsCompleteLogsList} key={log.id} />
      ))}
    </Masonry>
  );
};

export default LogList;
