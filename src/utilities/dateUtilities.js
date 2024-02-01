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
} from "date-fns";
import ja from "date-fns/locale/ja";

export const checkTaskDue = (dueString) => {
  const today = new Date();
  const due = parse(dueString, "yyyy年MM月dd日 HH時mm分", new Date(), {
    locale: ja,
  });
  const diffTime = due - today;
  return diffTime / (1000 * 60 * 60 * 24);
};

export const getSpanDate = (date) => {
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

export const checkLastLogCompleted = (lastCompleted) => {
  const span = getSpanDate(lastCompleted);
  const result = `${span.diffDays}日${span.diffHours}時間${span.diffMinutes}分`;
  return result.replace(/\b0[^\d\s]+\s*/g, "");
};

export const formatDateJa = (date) => {
  return format(date, "yyyy年MM月dd日");
};

export const formatTimeJa = (time) => {
  return format(time, "HH時mm分");
};

export const calculateNext期日 = (task, 更新元date) => {
  const 周期日数 = parseInt(task.周期日数);
  switch (task.周期3) {
    case "日":
      更新元date.setDate(更新元date.getDate() + 周期日数);
      break;
    case "週":
      更新元date.setDate(更新元date.getDate() + 周期日数 * 7);
      break;
    case "月":
      更新元date.setMonth(更新元date.getMonth() + 周期日数);
      break;
    case "年":
      更新元date.setFullYear(更新元date.getFullYear() + 周期日数);
      break;
    default:
      break;
  }
  return formatDateJa(更新元date);
};
