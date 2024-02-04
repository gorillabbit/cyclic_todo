import { createContext, useState, useContext, useEffect } from "react";
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

interface TaskContextProp {
  children: any;
}

type TaskContextType = {
  taskList: TaskType[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskType[]>>;
};

// Contextを作成（初期値は空のTaskListとダミーのsetTaskList関数）
export const TaskContext = createContext<TaskContextType>({
  taskList: [],
  setTaskList: () => {},
});

export const TaskProvider: React.FC<TaskContextProp> = ({ children }) => {
  const [taskList, setTaskList] = useState<TaskType[]>([]);

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
      setTaskList(tasksData);
    });

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeTask();
    };
  }, [auth.currentUser]);

  return (
    <TaskContext.Provider
      value={{
        taskList,
        setTaskList,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
