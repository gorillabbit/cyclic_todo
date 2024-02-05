import React, { useState } from "react";
import { addDocTask, deleteDocTask, updateDocTask } from "../../firebase.js";
import { calculateNext期日 } from "../../utilities/dateUtilities.js";
import { getBackgroundColor } from "../../utilities/taskUtilities.js";

import { serverTimestamp } from "firebase/firestore";
import TaskDetail from "./TaskDetail.js";
import { TaskType } from "../../types.js";
import { Box, Button, Card, Typography } from "@mui/material";
import ChildTasks from "./ChildTask";
import { getAuth } from "firebase/auth";
import { BodyTypography } from "../TypographyWrapper";

interface TaskProps {
  task: TaskType;
  setTaskList: React.Dispatch<React.SetStateAction<TaskType[]>>;
  tasklist?: TaskType[];
  type?: string;
}

const auth = getAuth();

const toggleCompletion = (task: TaskType) => {
  updateDocTask(task.id, {
    completed: !task.completed,
    toggleCompletionTimestamp: serverTimestamp(),
  });

  if (
    task.completed === false &&
    task.is周期的 === "完了後に追加" &&
    auth.currentUser
  ) {
    const newTask = {
      userId: auth.currentUser.uid,
      text: task.text,
      dueDate: calculateNext期日(task, new Date()),
      dueTime: task.dueTime,
      is周期的: "完了後に追加",
      周期日数: task.周期日数,
      周期単位: task.周期単位,
      親taskId: task.親taskId ?? task.id,
      completed: false,
    };
    addDocTask(newTask);
  }
};

const Task: React.FC<TaskProps> = ({ task, setTaskList, tasklist }) => {
  const backgroundColor = getBackgroundColor(
    task.hasDue
      ? task.hasDueTime
        ? task.dueDate + " " + task.dueTime
        : task.dueDate + " 23時59分"
      : ""
  );
  const tasklistStyle = {
    backgroundColor: task.completed ? "#c0c0c0" : backgroundColor,
    color: task.completed ? "#5f5f5f" : "",
  };

  const 子tasks = tasklist?.filter((listTask) => listTask.親taskId === task.id);
  const 親tasks = tasklist?.filter((listTask) => listTask.id === task.親taskId);

  const is完了後追加 = task.is周期的 === "完了後に追加";
  const [open, setOpen] = useState(false);

  return (
    <Card sx={tasklistStyle} onClick={() => setOpen((prevOpen) => !prevOpen)}>
      <Box m={2} textAlign="left">
        <Typography variant="h5" textAlign="center">
          {task.text}
        </Typography>
        {task.description && <BodyTypography text={task.description} />}
        {task.is周期的 !== "周期なし" && (
          <BodyTypography
            text={
              "周期" +
              (is完了後追加 && " タスク完了後 ") +
              task.周期日数 +
              task.周期単位
            }
          />
        )}
        {task.hasDue && (
          <BodyTypography
            text={
              (task.dueDate ? "期日 " : "") +
              task.dueDate?.toString() +
              task.dueTime?.toString()
            }
          />
        )}
        {open && <TaskDetail task={task} />}
        {open && 子tasks && 子tasks.length > 0 && (
          <ChildTasks tasks={子tasks} setTaskList={setTaskList} />
        )}
        {open && 親tasks && 親tasks.length > 0 && (
          <ChildTasks tasks={親tasks} setTaskList={setTaskList} />
        )}
      </Box>
      <Box display="flex" width="100%">
        <Button
          fullWidth
          color={task.completed ? "warning" : "success"}
          variant="contained"
          sx={{ borderRadius: "0px" }}
          onClick={() => toggleCompletion(task)}
        >
          {task.completed ? "取り消す" : "完了"}
        </Button>
        <Button
          fullWidth
          color="error"
          variant="contained"
          sx={{ borderRadius: "0px" }}
          onClick={() => deleteDocTask(task.id)}
        >
          削除
        </Button>
      </Box>
    </Card>
  );
};

export default Task;
