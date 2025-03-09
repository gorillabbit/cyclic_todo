import { Box } from '@mui/material';
import { LogProvider } from '../components/Context/LogContext';
import { TaskProvider } from '../components/Context/TaskContext';
import InputForms from '../components/InputForms/InputForms';
import LogList from '../components/Log/LogList';
import TaskList from '../components/Task/TaskList';
import { useIsSmall } from '../hooks/useWindowSize';
import Calendar from '../components/Calendar/Calendar';

const TaskPage = () => {
    const isSmall = useIsSmall();
    return (
        <TaskProvider>
            <LogProvider>
                <Box m={2}>
                    <InputForms />
                </Box>
                <Box m={isSmall ? 0 : 2}>
                    <LogList />
                    <TaskList />
                    <Calendar />
                </Box>
            </LogProvider>
        </TaskProvider>
    );
};

export default TaskPage;
