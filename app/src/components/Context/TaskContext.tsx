import { ReactNode, createContext, memo, useMemo } from 'react';
import { orderBy, where } from 'firebase/firestore';
import { TaskType } from '../../types.js';
import { useFirestoreQuery } from '../../utilities/firebaseUtilities';
import { useTab } from '../../hooks/useData.js';
import { dbNames } from '../../firebase.js';

export type TaskContextType = {
    taskList: TaskType[];
};

// Contextを作成（初期値は空のTaskListとダミーのsetTaskList関数）
export const TaskContext = createContext<TaskContextType>({
    taskList: [],
});

export const TaskProvider = memo(({ children }: { children: ReactNode }) => {
    const { tab_id } = useTab();
    const tasksQueryConstraints = useMemo(
        () => [orderBy('due_date'), orderBy('dueTime'), where('tab_id', '==', tab_id)],
        [tab_id]
    );

    const { documents: taskList } = useFirestoreQuery<TaskType>(
        dbNames.task,
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
});
