import { format } from 'date-fns';
import { Box, Typography } from '@mui/material';
import { TaskType } from '../../types';

function TaskDetails({ task }: { task: TaskType }) {
    // 完了タイムスタンプのフォーマット
    const completionTimestamp =
        task.completed && task.toggleCompletionTimestamp
            ? format(task.toggleCompletionTimestamp, 'yyyy-MM-dd HH:mm')
            : null;

    return (
        <Box>
            {task.completed && (
                <Typography variant="body2" color="text.secondary">
                    済 {completionTimestamp}
                </Typography>
            )}
        </Box>
    );
}

export default TaskDetails;
