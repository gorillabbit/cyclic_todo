import { MenuItem, Select, TextField, FormGroup, Button, Box } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { addDocTask, updateDocTask } from '../../firebase';
import { format, parse } from 'date-fns';
import { TaskInputType, TaskType } from '../../types.js';
import { getAuth } from 'firebase/auth';
import StyledCheckbox from '../StyledCheckbox';
import { useTab } from '../../hooks/useData.js';

interface TaskInputFormProp {
    date?: Date; // カレンダーからの日付指定
    openDialog?: boolean;
    buttonAction?: () => void;
    propTask?: TaskType; // 編集時のタスク情報
    setIsOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

const auth = getAuth();

const TaskInputForm = ({
    date,
    openDialog,
    buttonAction,
    propTask,
    setIsOpenEditDialog,
}: TaskInputFormProp) => {
    const { tabId } = useTab();
    const defaultNewTask: TaskInputType = propTask ?? {
        userId: '',
        text: '',
        hasDue: date ? true : false,
        dueDate: '',
        hasDueTime: date ? true : false,
        dueTime: '',
        is周期的: '周期なし',
        周期日数: '1',
        周期単位: '日',
        completed: false,
        icon: '',
        description: '',
        tabId,
    };

    const [newDueDate, setNewDueDate] = useState<Date>(
        date ??
            (propTask?.dueDate
                ? parse(propTask?.dueDate, 'yyyy年MM月dd日', new Date())
                : new Date())
    );
    const [newDueTime, setNewDueTime] = useState<Date>(
        date ??
            (propTask?.dueTime
                ? parse(propTask?.dueTime, 'HH時mm分', new Date())
                : new Date(new Date().setHours(0, 0, 0, 0)))
    );

    const [newTask, setNewTask] = useState<TaskInputType>(defaultNewTask);
    const handleNewTaskInput = (name: string, value: string | boolean) => {
        if (name === '周期日数' && typeof value === 'string' && parseInt(value, 10) <= 0) {
            alert('0以下は入力できません。');
            return;
        }
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, value: Date | null) => {
        if (value) {
            if (name === 'dueDate') setNewDueDate(value);
            if (name === 'dueTime') setNewDueTime(value);
        }
    };

    const validateTask = (task: TaskInputType) => ({
        ...task,
        dueDate: format(newDueDate, 'yyyy年MM月dd日'),
        dueTime: newDueTime ? format(newDueTime, 'HH時mm分') : '',
    });

    // タスクの追加
    const addTask = () => {
        if (newTask.text === '') return alert('タスクを入力してください。');
        if (auth.currentUser) {
            const validatedTask = validateTask(newTask);
            const userId = auth.currentUser.uid;
            addDocTask({ ...validatedTask, userId });
            setNewTask(defaultNewTask);
        }
        buttonAction?.();
    };

    const editTask = () => {
        const validatedTask = validateTask(newTask) as TaskType;
        updateDocTask(validatedTask.id, validatedTask);
        setIsOpenEditDialog?.(false);
    };

    return (
        <Box display="flex">
            <FormGroup row sx={{ gap: 1, m: 1, width: '100%' }}>
                <TextField
                    autoFocus
                    fullWidth
                    label="タスク"
                    value={newTask.text}
                    onChange={(e) => handleNewTaskInput('text', e.target.value)}
                />
                {(newTask.text || openDialog) && (
                    <>
                        <TextField
                            fullWidth
                            label="説明"
                            value={newTask.description}
                            multiline
                            onChange={(e) => handleNewTaskInput('description', e.target.value)}
                        />
                        <StyledCheckbox
                            value={newTask.hasDue}
                            handleCheckbox={() => handleNewTaskInput('hasDue', !newTask.hasDue)}
                        >
                            期日
                        </StyledCheckbox>
                        {newTask.hasDue && (
                            <DatePicker
                                label="期日-年月日"
                                value={newDueDate}
                                onChange={(value) => handleDateChange('dueDate', value)}
                                sx={{ maxWidth: 150 }}
                            />
                        )}

                        {newTask.hasDue && newDueDate && (
                            <>
                                <StyledCheckbox
                                    value={newTask.hasDueTime}
                                    handleCheckbox={() =>
                                        handleNewTaskInput('hasDueTime', !newTask.hasDueTime)
                                    }
                                >
                                    時刻
                                </StyledCheckbox>
                                {newTask.hasDueTime && (
                                    <TimePicker
                                        ampm={false}
                                        label="期日-時刻"
                                        value={newDueTime}
                                        onChange={(value) => handleDateChange('dueTime', value)}
                                        sx={{ maxWidth: 120 }}
                                    />
                                )}
                            </>
                        )}

                        <Select
                            label="周期"
                            value={newTask.is周期的}
                            onChange={(e) => handleNewTaskInput('is周期的', e.target.value)}
                        >
                            <MenuItem value="周期なし">周期なし</MenuItem>
                            <MenuItem value="完了後に追加">完了後にタスクを追加</MenuItem>
                            <MenuItem value="必ず追加">必ず追加</MenuItem>
                        </Select>
                        {newTask.is周期的 !== '周期なし' && (
                            <TextField
                                label="周期日数"
                                type="number"
                                value={newTask.周期日数}
                                onChange={(e) => handleNewTaskInput('周期日数', e.target.value)}
                                sx={{ maxWidth: 100 }}
                            />
                        )}
                        {newTask.is周期的 !== '周期なし' && (
                            <Select
                                value={newTask.周期単位}
                                onChange={(e) => handleNewTaskInput('周期単位', e.target.value)}
                            >
                                <MenuItem value="日">日</MenuItem>
                                <MenuItem value="週">週</MenuItem>
                                <MenuItem value="月">月</MenuItem>
                                <MenuItem value="年">年</MenuItem>
                            </Select>
                        )}
                    </>
                )}
            </FormGroup>
            <Button sx={{ my: 1 }} variant="contained" onClick={propTask ? editTask : addTask}>
                {propTask ? '変更' : '追加'}
            </Button>
        </Box>
    );
};

export default TaskInputForm;
