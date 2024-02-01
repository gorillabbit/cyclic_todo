import { Button, Dialog, DialogActions, TextField } from "@mui/material";
import React, { useState } from "react";
import { LogType } from "../../types";

interface MemoDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logComplete: (log: LogType, memo: string) => void;
  log: LogType;
}

const MemoDialog: React.FC<MemoDialogProps> = ({
  isOpen,
  setIsOpen,
  logComplete,
  log,
}) => {
  const [memo, setMemo] = useState<string>("");
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <TextField
        sx={{ m: 2 }}
        label="メモ"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      ></TextField>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>キャンセル</Button>
        <Button
          variant="contained"
          onClick={() => {
            logComplete(log, memo);
            setIsOpen(false);
          }}
        >
          完了
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MemoDialog;
