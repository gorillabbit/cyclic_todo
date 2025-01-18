import { Button } from "@mui/material";
import React from "react";
import { updateDocLog } from "../../firebase";
import { LogType } from "../../types.js";

interface LogDeleteButtonProps {
  log: LogType;
}

const archiveLog = (
  log: LogType,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  event.stopPropagation();
  updateDocLog(log.id, { archived: !log.archived });
};

const LogArchiveButton: React.FC<LogDeleteButtonProps> = ({ log }) => {
  return (
    <Button
      fullWidth
      variant="contained"
      color="warning"
      sx={{ borderRadius: "0px" }}
      onClick={(e) => archiveLog(log, e)}
    >
      {log.archived ? "有効化" : "無効化"}
    </Button>
  );
};

export default LogArchiveButton;
