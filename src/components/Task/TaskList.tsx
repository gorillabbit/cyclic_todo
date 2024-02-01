import { Masonry } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import Task from "./Task";
import React, { useEffect, useMemo, useState } from "react";

import { db } from "../../firebase.js";
import { orderBy, collection, onSnapshot, query } from "firebase/firestore";
import { TaskType } from "../../types.js";

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const unCompletedTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );
  const completedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.completed)
        .sort((a, b) => {
          // タイムスタンプを比較して並び替え
          const dateA = a.toggleCompletionTimestamp?.toDate() ?? new Date(0);
          const dateB = b.toggleCompletionTimestamp?.toDate() ?? new Date(0);
          return dateA.getTime() - dateB.getTime();
        }),
    [tasks]
  );

  useEffect(() => {
    //Taskの取得
    const tasksQuery = query(
      collection(db, "tasks"),
      orderBy("期日"),
      orderBy("時刻")
    );
    const unsubscribeTask = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksData: TaskType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as TaskType),
      }));
      setTasks(tasksData);
    });

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeTask();
    };
  }, []);

  return (
    <Box>
      <Typography variant="h5">タスク一覧</Typography>
      <Masonry
        sx={{ margin: "2px" }}
        columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
      >
        {unCompletedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            setTasks={setTasks}
            tasklist={tasks}
          />
        ))}
        {completedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            setTasks={setTasks}
            tasklist={tasks}
          />
        ))}
      </Masonry>
    </Box>
  );
};

export default TaskList;
