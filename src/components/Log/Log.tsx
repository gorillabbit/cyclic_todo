import React, { useState } from "react";
import { LogType, LogsCompleteLogsType } from "../../types";
import { format } from "date-fns";
import { Box, Typography, Card } from "@mui/material";
import { BodyTypography } from "../TypographyWrapper";
import Stopwatch from "./Stopwatch";
import LogHeader from "./LogHeader";
import CompleteLog from "./CompleteLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import LogStartButton from "./LogStartButton";
import LogDeleteButton from "./LogDeleteButton";
import LogCompleteButton from "./LogCompleteButton";
import LogFeature from "./LogFeature";

interface LogProps {
  log: LogType;
  logsCompleteLogs: LogsCompleteLogsType[];
}

const Log: React.FC<LogProps> = ({ log, logsCompleteLogs }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const completeLogs = logsCompleteLogs.filter(
    (logsCompleteLog: LogsCompleteLogsType) => logsCompleteLog.logId === log.id
  );
  const finishLogs = completeLogs.filter(
    (completeLog: LogsCompleteLogsType) => completeLog.type === "finish"
  );
  const lastCompletedLog = finishLogs[0];
  const isLastCompletedAvailable =
    !!lastCompletedLog && !!lastCompletedLog.timestamp;
  const lastCompleted =
    isLastCompletedAvailable && lastCompletedLog.timestamp
      ? format(lastCompletedLog.timestamp.toDate(), "yyyy-MM-dd HH:mm")
      : "";

  //durationが開始しているかどうか
  const isStarted = completeLogs[0]?.type === "start";

  return (
    <Box>
      <Card
        sx={{ backgroundColor: "#dfdfdf" }}
        onClick={() => setIsOpen((prevOpen) => !prevOpen)}
      >
        <LogHeader lastCompleted={lastCompleted} log={log} />
        <Box m={2} textAlign="left">
          <Typography variant="h5" textAlign="center">
            {log.icon && (
              <FontAwesomeIcon icon={["fas", log.icon as IconName]} />
            )}
            {log.text}
          </Typography>
          <BodyTypography
            visibility={isStarted ? "visible" : "hidden"}
            text={isStarted ? <Stopwatch log={log} /> : <div>blank</div>}
          />

          <LogFeature
            log={log}
            isLastCompletedAvailable={isLastCompletedAvailable}
            lastCompleted={lastCompleted}
            finishLogs={finishLogs}
            isOpen={isOpen}
          />

          {isOpen &&
            completeLogs.map((log: LogsCompleteLogsType) => (
              <CompleteLog completeLog={log} key={log.id} />
            ))}
        </Box>

        <Box display="flex" width="100%">
          {log.duration && !isStarted && <LogStartButton log={log} />}
          {(!log.duration || isStarted) && <LogCompleteButton log={log} />}
          <LogDeleteButton log={log} completeLogs={completeLogs} />
        </Box>
      </Card>
    </Box>
  );
};

export default Log;
