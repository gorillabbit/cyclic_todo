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
    const { tabId } = useTab();
    const tasksQueryConstraints = useMemo(
        () => [orderBy('dueDate'), orderBy('dueTime'), where('tabId', '==', tabId)],
        [tabId]
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
