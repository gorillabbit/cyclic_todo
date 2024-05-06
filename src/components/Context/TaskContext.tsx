import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy } from "firebase/firestore";
import { TaskType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";

type TaskContextType = {
  taskList: TaskType[];
};

// Contextを作成（初期値は空のTaskListとダミーのsetTaskList関数）
export const TaskContext = createContext<TaskContextType>({
  taskList: [],
});

export const TaskProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const tasksQueryConstraints = useMemo(
      () => [orderBy("dueDate"), orderBy("dueTime")],
      []
    );

    const { documents: taskList } = useFirestoreQuery<TaskType>(
      "tasks",
      tasksQueryConstraints
    );

    return (
      <TaskContext.Provider
        value={{
          taskList,
        }}
      >
        {children}
      </TaskContext.Provider>
    );
  }
);

export const useTask = () => useContext(TaskContext);
