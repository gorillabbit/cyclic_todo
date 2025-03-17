import React, { useState } from 'react';
import { calculateNext期日 } from '../../utilities/dateUtilities';
import { getBackgroundColor } from '../../utilities/taskUtilities';
import TaskDetail from './TaskDetail';
import { TaskType } from '../../types';
import { Box, Button, Card, Dialog, DialogContent, Typography } from '@mui/material';
import ChildTasks from './ChildTask';
import { getAuth } from 'firebase/auth';
import { BodyTypography } from '../TypographyWrapper';
import EditIcon from '@mui/icons-material/Edit';
import TaskInputForm from '../InputForms/TaskInputForm';
import { createTask, deleteTask, updateTask } from '../../api/combinedApi';

interface TaskProps {
    task: TaskType;
    setTaskList?: React.Dispatch<React.SetStateAction<TaskType[]>>;
    tasklist?: TaskType[];
    type?: string;
}

const auth = getAuth();

const toggleCompletion = async (task: TaskType) => {
    await updateTask(task.id, {
        completed: !task.completed,
        toggleCompletionTimestamp: new Date(),
    });

    if (task.completed === false && task.isCyclic === '完了後に追加' && auth.currentUser) {
        const newTask = {
            id: new Date().getTime().toString(),
            userId: auth.currentUser.uid,
            text: task.text,
            dueDate: calculateNext期日(task, new Date()),
            dueTime: task.dueTime,
            isCyclic: '完了後に追加',
            cyclicCount: task.cyclicCount,
            cyclicUnit: task.cyclicUnit,
            親taskId: task.親taskId ?? task.id,
            completed: false,
            hasDue: false,
            hasDueTime: false,
            icon: '',
            description: '',
            tabId: task.tabId,
        };
        createTask(newTask);
    }
};

const Task = ({ task, setTaskList, tasklist }: TaskProps) => {
    const backgroundColor = getBackgroundColor(
        task.hasDue
            ? task.hasDueTime
                ? task.dueDate + ' ' + task.dueTime
                : task.dueDate + ' 23時59分'
            : ''
    );
    const tasklistStyle = {
        backgroundColor: task.completed ? '#c0c0c0' : backgroundColor,
        color: task.completed ? '#5f5f5f' : '',
    };

    const 子tasks = tasklist?.filter((listTask) => listTask.親taskId === task.id);
    const 親tasks = tasklist?.filter((listTask) => listTask.id === task.親taskId);

    const is完了後追加 = task.isCyclic === '完了後に追加';
    const [open, setOpen] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState<boolean>(false);

    return (
        <>
            <Card sx={tasklistStyle} onClick={() => setOpen((prevOpen) => !prevOpen)}>
                <Box m={2} textAlign="left">
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <Typography
                            variant="h5"
                            textAlign="center"
                            sx={{ wordBreak: 'break-word' }}
                        >
                            {task.text}
                            <EditIcon
                                color="action"
                                sx={{
                                    ml: 1,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setIsOpenEditDialog(true)}
                            />
                        </Typography>
                    </Box>
                    {task.description && <BodyTypography text={task.description} />}
                    {task.isCyclic !== '周期なし' && (
                        <BodyTypography
                            text={
                                '周期' +
                                (is完了後追加 && ' タスク完了後 ') +
                                task.cyclicCount +
                                task.cyclicUnit
                            }
                        />
                    )}
                    {task.hasDue && (
                        <BodyTypography
                            text={
                                (task.dueDate ? '期日 ' : '') +
                                task.dueDate?.toString() +
                                task.dueTime?.toString()
                            }
                        />
                    )}
                    {open && <TaskDetail task={task} />}
                    {open && 子tasks && 子tasks.length > 0 && (
                        <ChildTasks tasks={子tasks} setTaskList={setTaskList} />
                    )}
                    {open && 親tasks && 親tasks.length > 0 && (
                        <ChildTasks tasks={親tasks} setTaskList={setTaskList} />
                    )}
                </Box>
                <Box display="flex" width="100%">
                    <Button
                        fullWidth
                        color={task.completed ? 'warning' : 'success'}
                        variant="contained"
                        sx={{ borderRadius: '0px' }}
                        onClick={() => toggleCompletion(task)}
                    >
                        {task.completed ? '取り消す' : '完了'}
                    </Button>
                    <Button
                        fullWidth
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: '0px' }}
                        onClick={() => deleteTask(task.id)}
                    >
                        削除
                    </Button>
                </Box>
            </Card>
            <Dialog open={isOpenEditDialog} onClose={() => setIsOpenEditDialog(false)}>
                <DialogContent>
                    <TaskInputForm
                        openDialog
                        propTask={task}
                        setIsOpenEditDialog={setIsOpenEditDialog}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Task;
