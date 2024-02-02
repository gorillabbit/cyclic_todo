import { Masonry } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import Task from "./Task";
import { useEffect, useMemo, useState } from "react";

import { db } from "../../firebase.js";
import {
  orderBy,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { TaskType } from "../../types.js";
import { getAuth } from "firebase/auth";

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

  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    //Taskの取得
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", auth.currentUser?.uid),
      orderBy("dueDate"),
      orderBy("dueTime")
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
  }, [auth.currentUser]);

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
