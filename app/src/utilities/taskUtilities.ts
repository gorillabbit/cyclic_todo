import { checkTaskDue } from './dateUtilities';

export const getBackgroundColor = (due_date: string) => {
    const diffDays = checkTaskDue(due_date);
    if (isNaN(diffDays)) {
        return '#F2F2F2';
    } else if (diffDays < 0) {
        return '#9C9C9C';
    } else if (diffDays < 3) {
        return '#EBBEC6'; // 期日が3日未満の場合は赤
    } else if (diffDays < 7) {
        return '#EBE0BE'; // 期日が7日未満の場合は黄色
    }
    return '#BEEBC6'; // それ以外の場合は緑
};
