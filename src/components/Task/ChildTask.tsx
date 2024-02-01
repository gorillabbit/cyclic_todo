import { Box } from "@mui/material";
import Task from "./Task";
import { TaskType } from "../../types.js";
import React from "react";

interface ChildTaskProps {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

const ChildTasks: React.FC<ChildTaskProps> = ({ tasks, setTasks }) => {
  return (
    <Box border="solid 2px #ffffff">
      子task
      {tasks.map((子task) => (
        <Task type="子task" key={子task.id} task={子task} setTasks={setTasks} />
      ))}
    </Box>
  );
};

export default ChildTasks;
