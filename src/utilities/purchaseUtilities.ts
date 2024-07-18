import { InputBaseComponentProps } from "@mui/material";
import { InputPurchaseScheduleType, WeekDay } from "../types";
import { db, dbNames, deleteDocPurchase } from "../firebase";
import { addMonths, nextDay, addDays, set } from "date-fns";
import {
  doc,
  collection,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { getPayLaterDate } from "./dateUtilities";
import { PurchaseDataType, PurchaseRawDataType } from "../types/purchaseTypes";

/**
 * 収支を合計する(収入は+、支出は-で表現されるので支出の合計は-になる)
 * @param purchasesList
 * @returns
 */
export const sumSpentAndIncome = (purchasesList: PurchaseDataType[]) =>
  purchasesList.reduce((acc, purchase) => acc + Number(purchase.difference), 0);

export const numericProps: InputBaseComponentProps = {
  inputMode: "numeric",
  pattern: "[0-9]*",
};

/**
 * 後払いの支払いであるかチェックする
 * @param purchase
 * @returns boolean
 */
export const isLaterPayment = (purchase: PurchaseDataType): boolean =>
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

/**
 * 収入か支出かでフィルターする
 * @param purchasesList
 * @param income
 * @returns フィルタリングされたpurchasesList
 */
export const filterPurchasesByIncomeType = (
  purchasesList: PurchaseDataType[],
  income: "income" | "spent"
) => {
  if (income === "income") {
    return purchasesList.filter((purchases) => purchases.difference < 0);
  } else {
    return purchasesList.filter((purchases) => purchases.difference >= 0);
  }
};

/**
 * 予定スケジュールの子タスクを削除する
 * @param purchaseList
 * @param purchaseSchedule
 */
export const deleteScheduledPurchases = async (
  purchaseList: PurchaseDataType[],
  purchaseScheduleId: string
) => {
  let update = purchaseList;
  for (const purchase of update) {
    if (purchase.parentScheduleId === purchaseScheduleId) {
      update = await deletePurchaseAndUpdateLater(purchase.id, purchaseList);
    }
  }
  return update;
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
/**
 * 指定日まで毎月の予定日を取得する
 * @param dayOfMonth
 * @param endDate
 * @returns
 */
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

/**
 * 指定曜日まで毎週の予定日を取得する
 * @param weekDayName
 * @param endDate
 * @returns
 */
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
 * オブジェクトの配列を指定されたパラメータで並び替えます。
 * @param {PurchaseDataType[]} objects - 並び替えるオブジェクトの配列
 * @param {keyof PurchaseDataType} parameter - 並び替えに使用するパラメータ
 * @param {boolean} [ascending=true] - 昇順に並び替えるかどうかを指定する値。デフォルトはtrue（昇順）
 * @returns {PurchaseDataType[]} 並び替えられたオブジェクトの配列
 */
export const sortObjectsByParameter = (
  objects: PurchaseDataType[],
  parameter: keyof PurchaseDataType,
  ascending: boolean = true
): PurchaseDataType[] => {
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

export const getLastPurchase = (
  date: Date,
  updatePurchases: PurchaseDataType[]
): PurchaseDataType | undefined => {
  return updatePurchases
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .find((purchase) => purchase.date <= date);
};

// ある時点より後の支払いすべてを更新する
export const updateAllLaterPurchases = (
  date: Date,
  difference: number,
  updatePurchases: PurchaseDataType[]
) => {
  if (difference === 0) return updatePurchases;
  return updatePurchases.map((purchase) => ({
    ...purchase,
    balance:
      purchase.date > date
        ? Number(purchase.balance) + Number(difference)
        : purchase.balance,
  }));
};

export const deletePurchaseAndUpdateLater = async (
  purchaseId: string,
  updatePurchases: PurchaseDataType[]
) => {
  const docSnap = await getDoc(doc(db, dbNames.purchase, purchaseId));
  const purchase = docSnap.data() as PurchaseRawDataType;
  deleteDocPurchase(purchaseId);
  const filteredPurchase = updatePurchases.filter((p) => p.id !== purchaseId);
  const difference = purchase.childPurchaseId ? 0 : -purchase.difference;
  return updateAllLaterPurchases(
    purchase.date.toDate(),
    difference,
    filteredPurchase
  );
};

export const addPurchaseAndUpdateLater = (
  purchase: PurchaseDataType,
  updatePurchases: PurchaseDataType[]
) => {
  const difference = purchase.childPurchaseId ? 0 : Number(purchase.difference);
  const purchases = updateAllLaterPurchases(
    purchase.date,
    difference,
    updatePurchases
  );
  const lastPurchase = getLastPurchase(purchase.date, purchases);
  const lastBalance = lastPurchase?.balance ?? 0;
  const newDocRef = doc(collection(db, dbNames.purchase));
  return {
    purchases: [
      ...purchases,
      {
        ...purchase,
        id: purchase.id ? purchase.id : newDocRef.id,
        balance: lastBalance + difference,
      },
    ],
    id: newDocRef.id,
  };
};

export const updatePurchaseAndUpdateLater = async (
  purchaseId: string, // 子供の支払いの場合は下のpurchaseと食い違うので必要
  purchase: PurchaseDataType,
  updatePurchases: PurchaseDataType[]
) => {
  const currentPurchases = updatePurchases.find((p) => p.id === purchaseId);
  if (!currentPurchases) return { purchases: updatePurchases };
  const updatedLaterPurchases = updateAllLaterPurchases(
    currentPurchases.date,
    -currentPurchases.difference,
    updatePurchases.filter((p) => p.id !== purchaseId)
  );
  return addPurchaseAndUpdateLater(purchase, updatedLaterPurchases);
};

/**
 * 未来の予定を追加する
 * @param docRef
 * @param purchaseSchedule
 */
export const addScheduledPurchase = (
  purchaseScheduleId: string,
  purchaseSchedule: InputPurchaseScheduleType,
  updatePurchases: PurchaseDataType[]
) => {
  const { price, income, method, cycle, date, endDate, day } = purchaseSchedule;
  const difference = income ? price : -price;
  const purchaseBase = {
    userId: purchaseSchedule.userId,
    title: purchaseSchedule.title,
    method,
    category: purchaseSchedule.category,
    description: purchaseSchedule.description,
    isUncertain: purchaseSchedule.isUncertain,
    tabId: purchaseSchedule.tabId,
    parentScheduleId: purchaseScheduleId,
    assetId: method.assetId,
    balance: 0,
  };

  const purchaseList: PurchaseDataType[] = [];
  const getDays = () => {
    if (cycle === "毎月" && date) return listMonthlyDaysUntil(date, endDate);
    if (cycle === "毎週" && day) return listWeeklyDaysUntil(day, endDate);
    return [];
  };
  getDays().forEach((dateDay, index) => {
    const docId = doc(collection(db, dbNames.purchase)).id;
    const hasLaterPayment = method.timing === "翌月";

    purchaseList.push({
      ...purchaseBase,
      date: dateDay,
      childPurchaseId: hasLaterPayment ? docId : "",
      difference: hasLaterPayment ? 0 : difference,
      id: "",
    });
    // カード払いの場合は後払いの日も追加する
    if (hasLaterPayment) {
      purchaseList.push({
        ...purchaseBase,
        id: docId,
        date: getPayLaterDate(
          set(dateDay, { milliseconds: index }),
          method.timingDate
        ),
        childPurchaseId: "",
        difference,
      });
    }
  });
  let newUpdatePurchases = updatePurchases;
  for (const purchase of purchaseList) {
    console.log(newUpdatePurchases);
    newUpdatePurchases = addPurchaseAndUpdateLater(
      purchase,
      newUpdatePurchases
    ).purchases;
  }

  return newUpdatePurchases;
};

export const updateAndAddPurchases = (updatePurchases: PurchaseDataType[]) => {
  updatePurchases.forEach(async (purchase) => {
    if (purchase.id) {
      const docRef = doc(db, dbNames.purchase, purchase.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateDoc(docRef, { ...purchase });
      } else {
        setDoc(docRef, purchase);
      }
    } else {
      addDoc(collection(db, dbNames.purchase), purchase);
    }
  });
};
