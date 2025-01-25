import {
    format,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    parse,
    differenceInMonths,
    differenceInWeeks,
    differenceInYears,
    differenceInSeconds,
    addMonths,
    lastDayOfMonth,
    startOfMonth,
} from 'date-fns';
import ja from 'date-fns/locale/ja';
import { TaskType } from '../types';

export const checkTaskDue = (dueString: string) => {
    const today = new Date();
    const due = parse(dueString, 'yyyy年MM月dd日 HH時mm分', new Date(), {
        locale: ja,
    });
    const diffTime = due.getTime() - today.getTime();
    return diffTime / (1000 * 60 * 60 * 24);
};

export const getSpanDate = (date: string | number | Date) => {
    const today = new Date();
    const due = new Date(date);
    const diffYears = differenceInYears(today, due);
    const diffMonths = differenceInMonths(today, due);
    const diffWeeks = differenceInWeeks(today, due);
    const diffDays = differenceInDays(today, due);
    const diffHours = differenceInHours(today, due) % 24;
    const diffMinutes = differenceInMinutes(today, due) % 60;
    const diffSeconds = differenceInSeconds(today, due) % 60;
    return {
        diffYears: diffYears,
        diffMonths: diffMonths,
        diffWeeks: diffWeeks,
        diffDays: diffDays,
        diffHours: diffHours,
        diffMinutes: diffMinutes,
        diffSeconds: diffSeconds,
    };
};

export const checkLastLogCompleted = (lastCompleted: string) => {
    const span = getSpanDate(lastCompleted);
    const result = `${span.diffDays}日${span.diffHours}時間${span.diffMinutes}分`;
    return result.replace(/\b0[^\d\s]+\s*/g, '');
};

export const formatDateJa = (date: number | Date) => {
    return format(date, 'yyyy年MM月dd日');
};

export const formatTimeJa = (time: number | Date) => {
    return format(time, 'HH時mm分');
};

export const calculateNext期日 = (task: TaskType, 更新元date: Date) => {
    const 周期日数 = parseInt(task.周期日数);
    switch (task.周期単位) {
    case '日':
        更新元date.setDate(更新元date.getDate() + 周期日数);
        break;
    case '週':
        更新元date.setDate(更新元date.getDate() + 周期日数 * 7);
        break;
    case '月':
        更新元date.setMonth(更新元date.getMonth() + 周期日数);
        break;
    case '年':
        更新元date.setFullYear(更新元date.getFullYear() + 周期日数);
        break;
    default:
        break;
    }
    return formatDateJa(更新元date);
};

export const getPayLaterDate = (baseDate: Date, dateNum: number) => {
    // 翌月を取得
    const nextMonth = addMonths(baseDate, 1);
    let nextMonthDate = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        dateNum,
        // 以下は後払いを時刻でソートして、並べるため 時刻で並べないと、どの後払いが後になるかわからない。
        // timestampは、更新するため、時刻が一緒になるので順序を判別できない
        nextMonth.getHours(),
        nextMonth.getMinutes(),
        nextMonth.getSeconds()
    );

    // 翌月にその日が存在しない場合、その月の最後の日を取得
    if (nextMonthDate.getMonth() !== nextMonth.getMonth()) {
        nextMonthDate = lastDayOfMonth(nextMonth);
    }
    return nextMonthDate;
};

// 次の月の1日を取得
export const getFutureMonthFirstDay = (addMonth = 1) => {
    return startOfMonth(addMonths(new Date(), addMonth));
};

export const getThisMonthFirstDay = () => {
    return startOfMonth(new Date());
};
