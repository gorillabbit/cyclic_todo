import { Button } from "@mui/material";
import { addDocLogsCompleteLogs } from "../../firebase";
import React from "react";
import { LogType } from "../../types.js";

interface LogStartButtonProps {
  log: LogType;
}

const logStart = (
  log: LogType,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  event.stopPropagation();
  const logsCompleteLogs = {
    logId: log.id,
    type: "start",
  };
  addDocLogsCompleteLogs(logsCompleteLogs);
};

const LogStartButton: React.FC<LogStartButtonProps> = ({ log }) => {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{ borderRadius: "0px" }}
      onClick={(event) => logStart(log, event)}
    >
      開始
    </Button>
  );
};

export default LogStartButton;
