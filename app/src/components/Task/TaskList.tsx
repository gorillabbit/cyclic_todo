import { Masonry } from '@mui/lab';
import { Box, Typography, Button } from '@mui/material';
import Task from './Task';
import { useMemo, useState } from 'react';
import { useTask } from '../../hooks/useData';

const TaskList = () => {
    const { taskList } = useTask();
    const [showCompleted, setShowCompleted] = useState(false); // Manage the display state of completed tasks
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
                    const dateA = a.toggleCompletionTimestamp ?? new Date(0);
                    const dateB = b.toggleCompletionTimestamp ?? new Date(0);
                    return dateA.getTime() - dateB.getTime();
                }),
        [taskList]
    );

    return (
        <Box>
            <Typography variant="h5">タスク一覧</Typography>
            <Masonry sx={{ margin: '2px' }} columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
                {uncompletedTaskList.map((task) => (
                    <Task key={task.id} task={task} tasklist={taskList} />
                ))}
            </Masonry>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowCompleted(!showCompleted)}
                sx={{ marginY: 2 }}
            >
                {showCompleted ? '完了タスクを非表示' : '完了タスクを表示'}
            </Button>
            {showCompleted && (
                <Masonry sx={{ margin: '2px' }} columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
                    {completedTaskList.map((task) => (
                        <Task key={task.id} task={task} tasklist={taskList} />
                    ))}
                </Masonry>
            )}
        </Box>
    );
};

export default TaskList;
