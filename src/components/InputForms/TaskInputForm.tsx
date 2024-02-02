import {
  MenuItem,
  Select,
  TextField,
  FormGroup,
  Button,
  Box,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { addDocTask } from "../../firebase.js";
import { format } from "date-fns";
import { TaskType } from "../../types.js";
import FontAwesomeIconPicker from "./FontAwesomeIconPicker";
import { getAuth } from "firebase/auth";

const now = new Date();

const defaultNewTask: TaskType = {
  userId: "",
  text: "",
  dueDate: now,
  dueTime: now,
  is周期的: "周期なし",
  周期日数: "1",
  周期単位: "日",
  completed: false,
  icon: "",
};

const auth = getAuth();

const TaskInputForm = () => {
  const [newTask, setNewTask] = useState<TaskType>(defaultNewTask);
  const handleNewTaskInput = (name: string, value: any) => {
    if (name === "周期日数" && parseInt(value, 10) <= 0) {
      alert("0以下は入力できません。");
      return;
    }
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const validateTask = (task: TaskType) => {
    return {
      ...task,
      dueDate: format(task.dueDate as unknown as number, "yyyy年MM月dd日"),
      dueTime: format(task.dueTime as unknown as number, "HH時mm分"),
    };
  };

  // タスクの追加
  const addTask = () => {
    if (newTask && auth.currentUser) {
      const validatedTask = validateTask(newTask);
      const taskToAdd =
        validatedTask.is周期的 === "周期なし"
          ? omitPeriodicFields(validatedTask)
          : validatedTask;
      const userId = auth.currentUser.uid;
      addDocTask({ ...taskToAdd, userId });
      setNewTask(defaultNewTask);
    }
  };

  // 周期的なフィールドを省略
  function omitPeriodicFields(task: TaskType) {
    const { 周期日数, 周期単位, ...rest } = task;
    return rest;
  }
  return (
    <Box display="flex">
      <FormGroup row={true} sx={{ gap: 1, m: 1, width: "100%" }}>
        <TextField
          autoFocus
          fullWidth
          required
          label="タスク"
          value={newTask.text}
          onChange={(e) => handleNewTaskInput("text", e.target.value)}
        />
        {newTask.text && (
          <>
            <FontAwesomeIconPicker
              value={newTask.icon ?? ""}
              onChange={handleNewTaskInput}
            />
            <DatePicker
              label="期日-年月日"
              value={newTask.dueDate}
              onChange={(value) => handleNewTaskInput("dueDate", value)}
              sx={{ maxWidth: 150 }}
            />
            <TimePicker
              ampm={false}
              label="期日-時刻"
              value={newTask.dueTime}
              onChange={(value) => handleNewTaskInput("dueTime", value)}
              sx={{ maxWidth: 120 }}
            />
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
      <Button sx={{ my: 1 }} variant="contained" onClick={addTask}>
        追加
      </Button>
    </Box>
  );
};

export default TaskInputForm;
