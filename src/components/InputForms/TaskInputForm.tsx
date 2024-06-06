import {
  MenuItem,
  Select,
  TextField,
  FormGroup,
  Button,
  Box,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { addDocTask, updateDocTask } from "../../firebase";
import { format } from "date-fns";
import { TaskInputType, TaskType } from "../../types.js";
import { getAuth } from "firebase/auth";
import StyledCheckbox from "../StyledCheckbox";
import { useTab } from "../Context/TabContext";

interface TaskInputFormProp {
  date?: Date;
  openDialog?: boolean;
  buttonAction?: () => void;
  propTask?: TaskType;
  setIsOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

const auth = getAuth();

const TaskInputForm: React.FC<TaskInputFormProp> = ({
  date,
  openDialog,
  buttonAction,
  propTask,
  setIsOpenEditDialog,
}) => {
  const { tabId } = useTab();
  const defaultNewTask: TaskInputType = propTask ?? {
    userId: "",
    text: "",
    hasDue: date ? true : false,
    dueDate: date ?? new Date(),
    hasDueTime: date ? true : false,
    dueTime: date ?? new Date(new Date().setHours(0, 0, 0, 0)),
    is周期的: "周期なし",
    周期日数: "1",
    周期単位: "日",
    completed: false,
    icon: "",
    description: "",
    tabId,
  };

  const [newTask, setNewTask] = useState<TaskInputType>(defaultNewTask);
  const handleNewTaskInput = (name: string, value: any) => {
    if (name === "周期日数" && parseInt(value, 10) <= 0) {
      alert("0以下は入力できません。");
      return;
    }
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const validateTask = (task: TaskInputType) => {
    return {
      ...task,
      dueDate: format(task.dueDate as unknown as number, "yyyy年MM月dd日"),
      dueTime: task.dueTime
        ? format(task.dueTime as unknown as number, "HH時mm分")
        : "",
    };
  };

  // タスクの追加
  const addTask = () => {
    if (newTask && auth.currentUser) {
      const validatedTask = validateTask(newTask);
      const userId = auth.currentUser.uid;
      addDocTask({ ...validatedTask, userId });
      setNewTask(defaultNewTask);
    }
    buttonAction?.();
  };

  const editTask = () => {
    if (newTask && auth.currentUser) {
      const validatedTask = validateTask(newTask) as TaskType;
      const userId = auth.currentUser.uid;
      updateDocTask(validatedTask.id, {
        ...validatedTask,
        userId,
      });
    }
    setIsOpenEditDialog?.(false);
  };

  return (
    <Box display="flex">
      <FormGroup row sx={{ gap: 1, m: 1, width: "100%" }}>
        <TextField
          autoFocus
          fullWidth
          required
          label="タスク"
          value={newTask.text}
          onChange={(e) => handleNewTaskInput("text", e.target.value)}
        />
        {(newTask.text || openDialog) && (
          <>
            <TextField
              fullWidth
              label="説明"
              value={newTask.description}
              multiline
              onChange={(e) =>
                handleNewTaskInput("description", e.target.value)
              }
            />
            <StyledCheckbox
              value={newTask.hasDue}
              handleCheckbox={() =>
                handleNewTaskInput("hasDue", !newTask.hasDue)
              }
            >
              期日
            </StyledCheckbox>

            {newTask.hasDue && (
              <DatePicker
                label="期日-年月日"
                value={newTask.dueDate}
                onChange={(value) => handleNewTaskInput("dueDate", value)}
                sx={{ maxWidth: 150 }}
              />
            )}

            {newTask.hasDue && newTask.dueDate && (
              <>
                <StyledCheckbox
                  value={newTask.hasDueTime}
                  handleCheckbox={() =>
                    handleNewTaskInput("hasDueTime", !newTask.hasDueTime)
                  }
                >
                  時刻
                </StyledCheckbox>
                {newTask.hasDueTime && (
                  <TimePicker
                    ampm={false}
                    label="期日-時刻"
                    value={newTask.dueTime}
                    onChange={(value) => handleNewTaskInput("dueTime", value)}
                    sx={{ maxWidth: 120 }}
                  />
                )}
              </>
            )}

            <Select
              label="周期"
              value={newTask.is周期的}
              onChange={(e) => handleNewTaskInput("is周期的", e.target.value)}
            >
              <MenuItem value="周期なし">周期なし</MenuItem>
              <MenuItem value="完了後に追加">完了後にタスクを追加</MenuItem>
              <MenuItem value="必ず追加">必ず追加</MenuItem>
            </Select>
            {newTask.is周期的 !== "周期なし" && (
              <TextField
                label="周期日数"
                type="number"
                value={newTask.周期日数}
                onChange={(e) => handleNewTaskInput("周期日数", e.target.value)}
                sx={{ maxWidth: 100 }}
              />
            )}
            {newTask.is周期的 !== "周期なし" && (
              <Select
                value={newTask.周期単位}
                onChange={(e) => handleNewTaskInput("周期単位", e.target.value)}
              >
                <MenuItem value="日">日</MenuItem>
                <MenuItem value="週">週</MenuItem>
                <MenuItem value="月">月</MenuItem>
                <MenuItem value="年">年</MenuItem>
              </Select>
            )}
          </>
        )}
      </FormGroup>
      <Button
        sx={{ my: 1 }}
        variant="contained"
        onClick={propTask ? editTask : addTask}
      >
        {propTask ? "変更" : "追加"}
      </Button>
    </Box>
  );
};

export default TaskInputForm;
