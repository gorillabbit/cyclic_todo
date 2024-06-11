import { InputBaseComponentProps } from "@mui/material";
import {
  AssetListType,
  InputPurchaseScheduleType,
  InputPurchaseType,
  PurchaseListType,
  WeekDay,
} from "../types";
import {
  batchAddDocPurchase,
  db,
  dbNames,
  deleteDocPurchase,
} from "../firebase";
import { addMonths, nextDay, addDays } from "date-fns";
import { doc, collection } from "firebase/firestore";
import { getPayLaterDate } from "./dateUtilities";
import { getAuth } from "firebase/auth";

/**
 * 収支を合計する(収入は+、支出は-で表現されるので支出の合計は-になる)
 * @param purchasesList
 * @returns
 */
export const sumSpentAndIncome = (purchasesList: PurchaseListType[]) =>
  purchasesList.reduce(
    (acc, purchase) =>
      purchase.income
        ? acc + Number(purchase.price)
        : acc - Number(purchase.price),
    0
  );

export const numericProps: InputBaseComponentProps = {
  inputMode: "numeric",
  pattern: "[0-9]*",
};

/**
 * 後払いの支払いであるかチェックする
 * @param purchase
 * @returns boolean
 */
export const isLaterPayment = (purchase: PurchaseListType): boolean =>
  purchase.method.timing === "翌月" && !purchase.childPurchaseId;

/**
 * 数値が0以下、NaNかどうか
 * @param value
 * @returns
 */
export const isValidatedNum = (value: string): boolean => {
  const numValue = Number(value);
  if (numValue < 0) {
    alert("0未満は入力できません");
    return false;
  } else if (Number.isNaN(numValue)) {
    alert("不適切な入力です");
    return false;
  } else {
    return true;
  }
};

export const filterPurchasesByIncomeType = (
  purchasesList: PurchaseListType[],
  income: "income" | "spent"
) => {
  if (income === "income") {
    return purchasesList.filter((purchases) => purchases.income === true);
  } else {
    return purchasesList.filter((purchases) => purchases.income === false);
  }
};

/**
 * 最新の残高を取得する
 * @param asset
 * @returns
 */
export const getLatestBalance = (asset: AssetListType) =>
  Number(asset.balanceLog.slice(-1)[0].balance)
    ? Number(asset.balanceLog.slice(-1)[0].balance)
    : 0;

/**
 * 予定スケジュールの子タスクを削除する
 * @param purchaseList
 * @param purchaseSchedule
 */
export const deleteScheduledPurchases = (
  purchaseList: PurchaseListType[],
  purchaseScheduleId: string
) => {
  purchaseList.forEach((purchase) => {
    if (purchase.parentScheduleId === purchaseScheduleId) {
      deleteDocPurchase(purchase.id);
    }
  });
};

const weekDays: Record<WeekDay, Day> = {
  日曜日: 0,
  月曜日: 1,
  火曜日: 2,
  水曜日: 3,
  木曜日: 4,
  金曜日: 5,
  土曜日: 6,
};

export const weekDaysString: WeekDay[] = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

const today = new Date();
// 指定日まで毎月の予定日を取得する
const listMonthlyDaysUntil = (dayOfMonth: number, endDate: Date) => {
  // 現在の日付が指定された日より後の場合、最初の日付を次の月に設定
  let startMonth = today.getMonth();
  if (today.getDate() > dayOfMonth) {
    startMonth += 1;
  }

  // 指定された日と月から最初の日付を設定
  let currentDate = new Date(today.getFullYear(), startMonth, dayOfMonth);

  const dates = [];
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addMonths(currentDate, 1);
  }
  return dates;
};

const listWeeklyDaysUntil = (weekDayName: WeekDay, endDate: Date): Date[] => {
  // 今日の日付から次の指定曜日を求める
  const dayOfWeek = weekDays[weekDayName];
  let currentDate = nextDay(today, dayOfWeek);
  const dates = [];

  // 指定された終了日まで繰り返し
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 7);
  }
  return dates;
};

/**
 * 未来の予定を追加する
 * @param docRef
 * @param purchaseSchedule
 */
export const addScheduledPurchase = (
  purchaseScheduleId: string,
  purchaseSchedule: InputPurchaseScheduleType
) => {
  const auth = getAuth();
  if (auth.currentUser) {
    let daysList: Date[] = [];
    if (purchaseSchedule.cycle === "毎月" && purchaseSchedule.date) {
      daysList = listMonthlyDaysUntil(
        purchaseSchedule.date,
        purchaseSchedule.endDate
      );
    }
    if (purchaseSchedule.cycle === "毎週" && purchaseSchedule.day) {
      daysList = listWeeklyDaysUntil(
        purchaseSchedule.day,
        purchaseSchedule.endDate
      );
    }
    const userId = auth.currentUser.uid;
    const batchPurchaseList: InputPurchaseType[][] = daysList.map((dateDay) => {
      const docId = doc(collection(db, dbNames.purchase)).id;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cycle, day, endDate, ...purchaseScheduleWithoutForSchedule } =
        purchaseSchedule;
      const basePurchase = {
        ...purchaseScheduleWithoutForSchedule,
        userId,
        parentScheduleId: purchaseScheduleId,
      };
      const createdPurchase: (InputPurchaseType & { id?: string })[] = [
        {
          ...basePurchase,
          date: dateDay,
          childPurchaseId:
            purchaseSchedule.method.timing === "翌月" ? docId : "",
        },
      ];
      // カード払いの場合は後払いの日も追加する
      if (purchaseSchedule.method.timing === "翌月") {
        createdPurchase.push({
          ...basePurchase,
          id: docId,
          date: getPayLaterDate(dateDay, purchaseSchedule.method.timingDate),
          childPurchaseId: "",
        });
      }
      return createdPurchase;
    });
    batchAddDocPurchase(batchPurchaseList.flat());
  }
};

/**
 * オブジェクトの配列を指定されたパラメータで並び替えます。
 * @param {PurchaseListType[]} objects - 並び替えるオブジェクトの配列
 * @param {keyof PurchaseListType} parameter - 並び替えに使用するパラメータ
 * @param {boolean} [ascending=true] - 昇順に並び替えるかどうかを指定する値。デフォルトはtrue（昇順）
 * @returns {PurchaseListType[]} 並び替えられたオブジェクトの配列
 */
export const sortObjectsByParameter = (
  objects: PurchaseListType[],
  parameter: keyof PurchaseListType,
  ascending: boolean = true
): PurchaseListType[] => {
  return objects.sort((a, b) => {
    if (parameter === "method") {
      if (a.method.label < b.method.label) return ascending ? -1 : 1;
      if (a.method.label > b.method.label) return ascending ? 1 : -1;
      return 0;
    }
    const aVal = a[parameter]; // このように代入しないと、型のチェックは行われない。Typescriptの型は変数に対して行われる式に対しては行われない
    const bVal = b[parameter];
    if (aVal && bVal) {
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
    }
    return 0;
  });
};
