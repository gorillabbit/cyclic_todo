import { Masonry } from "@mui/lab";
import Log from "./Log";
import { useLog } from "../Context/LogContext";

const LogList = () => {
  const { logList, logsCompleteLogsList, sharedLogList } = useLog();
  const mergerLogList = [...logList, ...sharedLogList];

  return (
    <>
      <Masonry
        sx={{ margin: "2px" }}
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
      <Masonry
        sx={{ margin: "2px" }}
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
    </>
  );
};

export default LogList;
