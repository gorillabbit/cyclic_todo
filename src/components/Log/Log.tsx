import React, { useState } from "react";
import { LogType, LogsCompleteLogsType } from "../../types";
import { format } from "date-fns";
import { Box, Typography, Card, Dialog, DialogContent } from "@mui/material";
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
import "../../App.css";
import LogInputForm from "../InputForms/LogInputForm";
import EditIcon from "@mui/icons-material/Edit";
interface LogProps {
  log: LogType;
  logsCompleteLogs: LogsCompleteLogsType[];
  openDialog?: boolean;
}

const Log: React.FC<LogProps> = ({ log, logsCompleteLogs, openDialog }) => {
  //カレンダーから開く場合最初から開いた状態にする
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(openDialog));

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

  const [isOpenEditDialog, setIsOpenEditDialog] = useState<boolean>(false);

  return (
    <>
      <Box>
        <Card
          sx={{
            backgroundColor: "#dfdfdf",
            position: "relative",
          }}
          onClick={() => setIsOpen((prevOpen) => !prevOpen)}
          raised={isStarted ? true : false}
        >
          {isStarted && (
            <Box
              className="loader"
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
          )}

          <LogHeader lastCompleted={lastCompleted} log={log} />
          <Box m={2} textAlign="left">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              {log.icon && (
                <FontAwesomeIcon icon={["fas", log.icon as IconName]} />
              )}
              <Typography
                variant="h5"
                textAlign="center"
                sx={{
                  wordBreak: "break-word",
                  marginTop: "-0.25em",
                }}
              >
                {log.text}
                <EditIcon
                  color="action"
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpenEditDialog(true)}
                />
              </Typography>
            </Box>
            {log.description && <BodyTypography text={log.description} />}
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
      <Dialog
        open={isOpenEditDialog}
        onClose={() => setIsOpenEditDialog(false)}
      >
        <DialogContent>
          <LogInputForm
            openDialog={true}
            propLog={log}
            setIsOpenEditDialog={setIsOpenEditDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Log;
