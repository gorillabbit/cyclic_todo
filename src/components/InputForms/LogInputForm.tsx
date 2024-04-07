import {
  FormGroup,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useState } from "react";
import { addDocLog, updateDocLog } from "../../firebase.js";
import { InputLogType, LogType } from "../../types.js";
import StyledCheckbox from "../StyledCheckbox";
import FontAwesomeIconPicker from "./FontAwesomeIconPicker";
import { getAuth } from "firebase/auth";
import { useAccount } from "../Context/AccountContext";

interface LogInputFormProp {
  propLog?: LogType;
  openDialog?: boolean;
  setIsOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

const auth = getAuth();

const LogInputForm: React.FC<LogInputFormProp> = ({
  propLog,
  openDialog,
  setIsOpenEditDialog,
}) => {
  const { Account } = useAccount();
  const defaultNewLog: InputLogType = {
    userId: "",
    text: "",
    duration: false,
    interval: false,
    intervalNum: 1,
    intervalUnit: "日",
    availableMemo: false,
    availableVoiceAnnounce: false,
    voiceAnnounceNum: 1,
    voiceAnnounceUnit: "分",
    icon: "",
    displayFeature: [],
    description: "",
    archived: false,
    accessibleAccounts: [
      {
        name: Account?.name ?? "",
        email: Account?.email ?? "",
        icon: Account?.icon ?? "",
      },
    ],
    accessibleAccountsEmails: [Account?.email ?? ""],
  };

  const [newLog, setNewLog] = useState<InputLogType | LogType>(
    propLog ?? defaultNewLog
  );

  const handleNewLogInput = (name: string, value: any) => {
    if (name === "intervalNum" && parseInt(value, 10) <= 0) {
      alert("0以下は入力できません。");
      return;
    }

    if (name === "accessibleAccounts" && value.length !== 0) {
      value = value.map((account: string) => {
        const values = account.split(",");
        return {
          name: values[0],
          email: values[1],
          icon: values[2],
        };
      });
      setNewLog((prev) => ({
        ...prev,
        accessibleAccountsEmails: value.map(
          (account: { email: string }) => account.email
        ),
      }));
    }
    setNewLog((prev) => ({ ...prev, [name]: value }));
  };

  const addLog = () => {
    if (newLog && auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocLog({ ...newLog, userId });
      setNewLog(defaultNewLog);
    }
  };

  const editLog = () => {
    if (newLog && auth.currentUser) {
      const userId = auth.currentUser.uid;
      updateDocLog((newLog as LogType).id, { ...newLog, userId });
    }
    setIsOpenEditDialog?.(false);
  };

  return (
    <Box display="flex">
      <FormGroup row={true} sx={{ gap: 1, m: 1, width: "100%" }}>
        <TextField
          fullWidth
          autoFocus
          required
          label="ログ"
          value={newLog.text}
          onChange={(e) => handleNewLogInput("text", e.target.value)}
          placeholder="記録を入力"
        />
        {(newLog.text || openDialog) && (
          <>
            <TextField
              fullWidth
              label="説明"
              value={newLog.description}
              multiline
              onChange={(e) => handleNewLogInput("description", e.target.value)}
              placeholder="説明を入力"
            />
            <FontAwesomeIconPicker
              value={newLog.icon ?? ""}
              onChange={handleNewLogInput}
            />
            <StyledCheckbox
              value={newLog.duration}
              handleCheckbox={() =>
                handleNewLogInput("duration", !newLog.duration)
              }
            >
              スパン
            </StyledCheckbox>
            {newLog.duration && (
              <>
                <StyledCheckbox
                  value={newLog.availableVoiceAnnounce}
                  handleCheckbox={() =>
                    handleNewLogInput(
                      "availableVoiceAnnounce",
                      !newLog.availableVoiceAnnounce
                    )
                  }
                >
                  音声案内
                </StyledCheckbox>
                {newLog.availableVoiceAnnounce && (
                  <TextField
                    label="間隔"
                    value={newLog.voiceAnnounceNum}
                    type="number"
                    onChange={(e) =>
                      handleNewLogInput("voiceAnnounceNum", e.target.value)
                    }
                    sx={{ maxWidth: 100 }}
                  />
                )}
                {newLog.availableVoiceAnnounce && (
                  <Select
                    value={newLog.voiceAnnounceUnit}
                    onChange={(e) =>
                      handleNewLogInput("voiceAnnounceUnit", e.target.value)
                    }
                  >
                    <MenuItem value="秒">秒</MenuItem>
                    <MenuItem value="分">分</MenuItem>
                    <MenuItem value="時">時</MenuItem>
                    <MenuItem value="日">日</MenuItem>
                    <MenuItem value="週">週</MenuItem>
                    <MenuItem value="月">月</MenuItem>
                    <MenuItem value="年">年</MenuItem>
                  </Select>
                )}
              </>
            )}
            <StyledCheckbox
              value={newLog.interval}
              handleCheckbox={() =>
                handleNewLogInput("interval", !newLog.interval)
              }
            >
              標準間隔
            </StyledCheckbox>
            {newLog.interval && (
              <>
                <TextField
                  label="間隔"
                  value={newLog.intervalNum}
                  type="number"
                  onChange={(e) =>
                    handleNewLogInput("intervalNum", e.target.value)
                  }
                  sx={{ maxWidth: 100 }}
                />
                <Select
                  value={newLog.intervalUnit}
                  onChange={(e) =>
                    handleNewLogInput("intervalUnit", e.target.value)
                  }
                >
                  <MenuItem value="秒">秒</MenuItem>
                  <MenuItem value="分">分</MenuItem>
                  <MenuItem value="時">時</MenuItem>
                  <MenuItem value="日">日</MenuItem>
                  <MenuItem value="週">週</MenuItem>
                  <MenuItem value="月">月</MenuItem>
                  <MenuItem value="年">年</MenuItem>
                </Select>
              </>
            )}
            <StyledCheckbox
              value={newLog.availableMemo}
              handleCheckbox={() =>
                handleNewLogInput("availableMemo", !newLog.availableMemo)
              }
            >
              完了時メモ
            </StyledCheckbox>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>共有アカウント</InputLabel>
              <Select
                multiple
                value={newLog.accessibleAccounts.map(
                  (account) =>
                    account.name + "," + account.email + "," + account.icon
                )}
                label="共有アカウント"
                onChange={(e) =>
                  handleNewLogInput("accessibleAccounts", e.target.value)
                }
              >
                {Account?.linkedAccounts.map((account) => (
                  <MenuItem
                    key={account.name}
                    value={
                      account.name + "," + account.email + "," + account.icon
                    }
                  >
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </FormGroup>
      <Button
        sx={{ my: 1 }}
        variant="contained"
        onClick={propLog ? editLog : addLog}
      >
        {propLog ? "変更" : "追加"}
      </Button>
    </Box>
  );
};

export default LogInputForm;
