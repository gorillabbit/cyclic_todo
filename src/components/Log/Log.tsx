import React, { useEffect, useState } from "react";
import { LogType, LogsCompleteLogsType } from "../../types";
import { format, differenceInDays } from "date-fns";
import { checkLastLogCompleted } from "../../utilities/dateUtilities";
import { Box, Typography, Card } from "@mui/material";
import { BodyTypography } from "../TypographyWrapper";
import Stopwatch from "./Stopwatch";
import LogHeader from "./LogHeader";
import CompleteLog from "./CompleteLog";
import ChipWrapper from "../ChipWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import LogStartButton from "./LogStartButton";
import LogDeleteButton from "./LogDeleteButton";
import LogCompleteButton from "./LogCompleteButton";
import LogDisplayFeatureSelector from "./LogDisplayFeatureSelector";

interface LogProps {
  log: LogType;
  logsCompleteLogs: LogsCompleteLogsType[];
}

const Log: React.FC<LogProps> = ({ log, logsCompleteLogs }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //前回からの経過時間を表示する
  const [intervalFromLastCompleted, setIntervalFromLastCompleted] =
    useState<string>("");

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

  useEffect(() => {
    if (isLastCompletedAvailable) {
      const lastLogCompleted = checkLastLogCompleted(lastCompleted) || "0分";
      setIntervalFromLastCompleted(lastLogCompleted);
      const timerId = setInterval(() => {
        setIntervalFromLastCompleted(lastLogCompleted);
      }, 1000 * 60); // 1分ごとに更新
      return () => {
        clearInterval(timerId);
      };
    }
  }, [lastCompleted, isLastCompletedAvailable]);
  //これまでの完了回数
  const completedCounts = finishLogs.length;
  const todayCompletedCounts = finishLogs.filter(
    (finishLog) =>
      differenceInDays(
        new Date(),
        finishLog.timestamp ? finishLog.timestamp.toDate() : new Date()
      ) < 1
  );

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
          {intervalFromLastCompleted && (
            <ChipWrapper label={"前回から" + intervalFromLastCompleted} />
          )}

          {log.interval && (
            <ChipWrapper
              label={"標準間隔" + log.intervalNum + log.intervalUnit}
            />
          )}
          <ChipWrapper label={"本日" + todayCompletedCounts.length + "回"} />
          <ChipWrapper label={"通算" + completedCounts + "回"} />
          {log.availableVoiceAnnounce && (
            <ChipWrapper
              label={"音声案内 " + log.voiceAnnounceNum + log.voiceAnnounceUnit}
            />
          )}
          {isOpen && <LogDisplayFeatureSelector log={log} />}

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
