import { InputBaseComponentProps } from '@mui/material';
import { InputPurchaseScheduleType, MethodListType, WeekDay } from '../types';
import { addMonths, nextDay, addDays } from 'date-fns';
import { getPayLaterDate } from './dateUtilities';
import { PurchaseDataType } from '../types/purchaseTypes';
import { useMethod } from '../hooks/useData';
import { createPurchase, deletePurchase, getPurchases } from './apiClient';

/**
 * 収支を合計する(収入は+、支出は-で表現されるので支出の合計は-になる)
 * @param purchasesList
 * @returns
 */
export const sumSpentAndIncome = (purchasesList: PurchaseDataType[]):number =>
    purchasesList.reduce((acc, purchase) => acc + Number(purchase.difference), 0);

export const numericProps: InputBaseComponentProps = {
    inputMode: 'numeric',
    pattern: '[0-9]*',
};

/**
 * 後払いの支払いであるかチェックする
 * @param purchase
 * @returns boolean
 */
export const isLaterPayment = (method:MethodListType | undefined): boolean =>
    method?.timing !== '即時';

export const is今月の支払いwithout後払いの支払い = (
    purchase: PurchaseDataType,
    currentMonth: Date
): boolean => {
    const is購入が今月 = purchase.date.getMonth() === currentMonth.getMonth();
    const is後払いではない = purchase.category !== '後支払い';
    return is購入が今月 && is後払いではない;
};

/**
 * 数値が0以下、NaNかどうか
 * @param value
 * @returns
 */
export const validatedNum = (value: string): string => {
    const numValue = Number(value);
    if (numValue < 0) {
        return '0未満は入力できません';
    } else if (Number.isNaN(numValue)) {
        return '不適切な入力です';
    }
    return '';
};

/**
 * 収入か支出かでフィルターする
 * @param purchasesList
 * @param income
 * @returns フィルタリングされたpurchasesList
 */
export const filterPurchasesByIncomeType = (
    purchasesList: PurchaseDataType[],
    income: 'income' | 'spent'
): PurchaseDataType[] => {
    if (income === 'income') {
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
    purchaseScheduleId: string
):Promise<void> => {
    const targetPurchases =await getPurchases(
        [{ field: 'parent_schedule_id', value: purchaseScheduleId }]
    );
    for (const purchase of targetPurchases) {
        await deletePurchase(purchase.id);
    }
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
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
];

const today = new Date();
/**
 * 指定日まで毎月の予定日を取得する
 * @param dayOfMonth
 * @param end_date
 * @returns
 */
const listMonthlyDaysUntil = (dayOfMonth: number, end_date: Date): Date[] => {
    // 現在の日付が指定された日より後の場合、最初の日付を次の月に設定
    let startMonth = today.getMonth();
    if (today.getDate() > dayOfMonth) {
        startMonth += 1;
    }

    // 指定された日と月から最初の日付を設定
    let currentDate = new Date(today.getFullYear(), startMonth, dayOfMonth);

    const dates = [];
    while (currentDate <= end_date) {
        dates.push(currentDate);
        currentDate = addMonths(currentDate, 1);
    }
    return dates;
};

/**
 * 指定曜日まで毎週の予定日を取得する
 * @param weekDayName
 * @param end_date
 * @returns
 */
const listWeeklyDaysUntil = (weekDayName: WeekDay, end_date: Date): Date[] => {
    // 今日の日付から次の指定曜日を求める
    const dayOfWeek = weekDays[weekDayName];
    let currentDate = nextDay(today, dayOfWeek);
    const dates = [];

    // 指定された終了日まで繰り返し
    while (currentDate <= end_date) {
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
        if (parameter === 'method') {
            if (a.method < b.method) return ascending ? -1 : 1;
            if (a.method > b.method) return ascending ? 1 : -1;
            return 0;
        }
        const aVal = a[parameter]; // このように代入しないと、型のチェックは行われない。Typescriptの型は変数に対して行われる式に対しては行われない
        const bVal = b[parameter];
        if (aVal !== undefined && aVal !== null && bVal !== undefined && bVal !== null) {
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
        }
        return 0;
    });
};

/**
 * asset_idが同じ支払いのうち、dateが指定された日付より前の最後の支払いの残高を取得する
 * @param asset_id
 * @param date
 * @param updatePurchases
 * @returns
 */
export const getLastBalance = (
    asset_id: string,
    date: Date,
    updatePurchases: PurchaseDataType[]
): number => {
    const lastPurchase = updatePurchases
        .filter((p) => p.asset_id === asset_id)
        .sort((a, b) => b.pay_date.getTime() - a.pay_date.getTime())
        .find((purchase) => purchase.pay_date <= date);
    // NaNに対応するために??ではなく三項演算子を使う
    return Number(lastPurchase?.balance) ? Number(lastPurchase?.balance) : 0;
};

/**
 * 未来の予定を追加する
 * @param docRef
 * @param purchaseSchedule
 */
export const addScheduledPurchase = async (
    purchaseScheduleId: string,
    purchaseSchedule: InputPurchaseScheduleType,
):Promise<PurchaseDataType[] | undefined> => {
    const { methodList } = useMethod();
    const { price, income, method, cycle, date, end_date, day } = purchaseSchedule;
    const currentMethod = methodList.find((m) => m.id === method);
    if (currentMethod === undefined) return;
    const difference = income ? price : -price;
    const purchaseBase = {
        user_id: purchaseSchedule.user_id,
        title: purchaseSchedule.title,
        method,
        category: purchaseSchedule.category,
        description: purchaseSchedule.description,
        is_uncertain: purchaseSchedule.is_uncertain,
        tab_id: purchaseSchedule.tab_id,
        parent_schedule_id: purchaseScheduleId,
        asset_id: currentMethod.asset_id,
        balance: 0,
        difference,
        id: new Date().getTime().toString(),
    };

    const purchaseList: PurchaseDataType[] = [];
    const getDays = ():Date[] => {
        if (cycle === '毎月' && date !== undefined) return listMonthlyDaysUntil(date, end_date);
        if (cycle === '毎週' && day) return listWeeklyDaysUntil(day, end_date);
        return [];
    };
    getDays().forEach((dateDay) => purchaseList.push({
        ...purchaseBase,
        date: dateDay,
        pay_date: currentMethod.timing === '即時' ? 
            dateDay : 
            getPayLaterDate(dateDay, currentMethod.timing_date),
    }));
    for (const purchase of purchaseList) {
        await createPurchase(purchase);
    }

    return
};

export const getPayDate = (method: MethodListType, date:Date): Date => {
    const { timing, timing_date } = method;
    return timing === '即時' ? date : getPayLaterDate(date, timing_date);
};
