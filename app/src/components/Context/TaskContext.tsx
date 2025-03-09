import { ReactNode, createContext, memo, useEffect, useState } from 'react';
import { TaskType } from '../../types.js';
import { useTab } from '../../hooks/useData.js';
import { getTask } from '../../api/combinedApi.js';

export type TaskContextType = {
    taskList: TaskType[];
};

// Contextを作成（初期値は空のTaskListとダミーのsetTaskList関数）
export const TaskContext = createContext<TaskContextType>({
    taskList: [],
});

export const TaskProvider = memo(({ children }: { children: ReactNode }) => {
    const { tabId } = useTab();
    const [taskList, setTaskList] = useState<TaskType[]>([]);

    useEffect(() => {
        const fetchTask = async () => {
            const taskList = await getTask({ tabId });
            setTaskList(taskList);
        };
        fetchTask();
    }, [tabId]);

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
