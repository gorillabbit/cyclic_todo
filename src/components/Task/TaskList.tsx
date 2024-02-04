import { Masonry } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import Task from "./Task";
import { useMemo } from "react";
import { useTask } from "../Context/TaskContext";

const TaskList = () => {
  const { taskList, setTaskList } = useTask();
  const uncompletedTaskList = useMemo(
    () => taskList.filter((task) => !task.completed),
    [taskList]
  );
  const completedTaskList = useMemo(
    () =>
      taskList
        .filter((task) => task.completed)
        .sort((a, b) => {
          // タイムスタンプを比較して並び替え
          const dateA = a.toggleCompletionTimestamp?.toDate() ?? new Date(0);
          const dateB = b.toggleCompletionTimestamp?.toDate() ?? new Date(0);
          return dateA.getTime() - dateB.getTime();
        }),
    [taskList]
  );

  return (
    <Box>
      <Typography variant="h5">タスク一覧</Typography>
      <Masonry
        sx={{ margin: "2px" }}
        columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
      >
        {uncompletedTaskList.map((task) => (
          <Task
            key={task.id}
            task={task}
            setTaskList={setTaskList}
            tasklist={taskList}
          />
        ))}
        {completedTaskList.map((task) => (
          <Task
            key={task.id}
            task={task}
            setTaskList={setTaskList}
            tasklist={taskList}
          />
        ))}
      </Masonry>
    </Box>
  );
};

export default TaskList;
