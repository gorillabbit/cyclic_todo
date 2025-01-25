import { InputBaseComponentProps } from '@mui/material';
import { InputPurchaseScheduleType, MethodListType, WeekDay } from '../types';
import { db, dbNames, deleteDocPurchase } from '../firebase';
import { addMonths, nextDay, addDays } from 'date-fns';
import {
    doc,
    collection,
    getDoc,
    updateDoc,
    setDoc,
    addDoc,
    query,
    orderBy,
    getDocs,
    writeBatch,
} from 'firebase/firestore';
import { getPayLaterDate } from './dateUtilities';
import { PurchaseDataType, PurchaseRawDataType } from '../types/purchaseTypes';
import { useMethod } from '../hooks/useData';

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
    purchaseList: PurchaseDataType[],
    purchaseScheduleId: string
):Promise<PurchaseDataType[]> => {
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
 * @param endDate
 * @returns
 */
const listMonthlyDaysUntil = (dayOfMonth: number, endDate: Date): Date[] => {
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
 * assetIdが同じ支払いのうち、dateが指定された日付より前の最後の支払いの残高を取得する
 * @param assetId
 * @param date
 * @param updatePurchases
 * @returns
 */
export const getLastBalance = (
    assetId: string,
    date: Date,
    updatePurchases: PurchaseDataType[]
): number => {
    const lastPurchase = updatePurchases
        .filter((p) => p.assetId === assetId)
        .filter((p) => Boolean(p.payDate))
        .sort((a, b) => b.payDate.getTime() - a.payDate.getTime())
        .find((purchase) => purchase.payDate <= date);
    // NaNに対応するために??ではなく三項演算子を使う
    return Number(lastPurchase?.balance) ? Number(lastPurchase?.balance) : 0;
};

// ある時点より後の支払いすべてを更新する
export const updateAllLaterPurchases = (
    assetId: string,
    payDate: Date,
    difference: number,
    updatePurchases: PurchaseDataType[]
):PurchaseDataType[] => {
    if (difference === 0) return updatePurchases;
    const filteredPurchases = updatePurchases.filter((p) => p.assetId === assetId);
    const restPurchases = updatePurchases.filter((p) => p.assetId !== assetId);
    return [
        ...filteredPurchases.map((p) => ({
            ...p,
            balance:
                p.payDate > payDate ? Number(p.balance) + Number(difference) : Number(p.balance),
        })),
        ...restPurchases,
    ];
};

export const deletePurchaseAndUpdateLater = async (
    purchaseId: string,
    updatePurchases: PurchaseDataType[]
):Promise<PurchaseDataType[]> => {
    const docSnap = await getDoc(doc(db, dbNames.purchase, purchaseId));
    const purchase = docSnap.data() as PurchaseRawDataType;
    deleteDocPurchase(purchaseId);
    const filteredPurchase = updatePurchases.filter((p) => p.id !== purchaseId);
    return updateAllLaterPurchases(
        purchase.assetId,
        purchase.payDate.toDate(),
        Number(-purchase.difference),
        filteredPurchase
    );
};

export const addPurchaseAndUpdateLater = (
    purchase: PurchaseDataType,
    updatePurchases: PurchaseDataType[]
):{
    purchases: PurchaseDataType[];
    id: string;
} => {
    const difference = Number(purchase.difference);
    const purchases = updateAllLaterPurchases(
        purchase.assetId,
        purchase.payDate,
        difference,
        updatePurchases
    );
    const lastBalance = getLastBalance(purchase.assetId, purchase.date, purchases);
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
    purchase: PurchaseDataType,
    updatePurchases: PurchaseDataType[]
):Promise<{
    purchases: PurchaseDataType[];
    id: string;
} | {
    purchases: PurchaseDataType[];
}> => {
    // purchaseIdで指定した支払いを取得して、その支払いの差額を計算して、引く
    // その後のcurrentPurchase以外の支払いを更新する
    const currentPurchases = updatePurchases.find((p) => p.id === purchase.id);
    if (!currentPurchases) return { purchases: updatePurchases };
    const updatedLaterPurchases = updateAllLaterPurchases(
        currentPurchases.assetId,
        currentPurchases.payDate,
        -currentPurchases.difference,
        updatePurchases.filter((p) => p.id !== purchase.id)
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
):PurchaseDataType[] | undefined => {
    const { methodList } = useMethod();
    const { price, income, method, cycle, date, endDate, day } = purchaseSchedule;
    const currentMethod = methodList.find((m) => m.id === method);
    if (!currentMethod) return;
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
        assetId: currentMethod.assetId,
        balance: 0,
        difference,
        id: '',
    };

    const purchaseList: PurchaseDataType[] = [];
    const getDays = ():Date[] => {
        if (cycle === '毎月' && date) return listMonthlyDaysUntil(date, endDate);
        if (cycle === '毎週' && day) return listWeeklyDaysUntil(day, endDate);
        return [];
    };
    getDays().forEach((dateDay) => purchaseList.push({
        ...purchaseBase,
        date: dateDay,
        payDate: currentMethod.timing === '即時' ? 
            dateDay : 
            getPayLaterDate(dateDay, currentMethod.timingDate),
    }));
    let newUpdatePurchases = updatePurchases;
    for (const purchase of purchaseList) {
        newUpdatePurchases = addPurchaseAndUpdateLater(purchase, newUpdatePurchases).purchases;
    }

    return newUpdatePurchases;
};

export const updateAndAddPurchases = (updatePurchases: PurchaseDataType[]):void => {
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

interface oldPurchases extends PurchaseRawDataType {
    price?: number;
    income?: boolean;
}
export const updateDocuments = async ():Promise<void> => {
    const q = query(collection(db, dbNames.purchase), orderBy('payDate', 'asc'));
    const data = await getDocs(q);

    if (data.empty) return console.error('データがありません');

    const batch = writeBatch(db);
    const lastPurchases: Record<string, number> = {};
    const purchases = await Promise.all(
        data.docs.map(async (doc) => {
            return { ...({ id: doc.id, ...doc.data() } as oldPurchases), doc };
        })
    );
    const { methodList } = useMethod();

    purchases.forEach((data) => {
        console.log(data);
        if (!data.tabId) return;
        const assetId = methodList.find((m) => m.id === data.method)?.assetId;
        if (!assetId) return;
        const lastBalances = lastPurchases[assetId];
        if (!lastBalances) lastPurchases[assetId] = 0;
        const difference = data.difference ?? (data.income ? data.price : -(data.price ?? 0));
        const balance = Number(lastBalances ? lastBalances : 0) + Number(difference);

        const docRef = doc(db, dbNames.purchase, data.id);
        batch.update(docRef, {
            difference,
            balance,
            assetId: assetId,
            timestamp: new Date(),
        });

        lastPurchases[assetId] = balance;
    });
    await batch.commit();
    window.location.reload();
    console.log('データを更新しました');
};

export const getPayDate = (method: MethodListType, date:Date): Date => {
    const { timing, timingDate } = method;
    return timing === '即時' ? date : getPayLaterDate(date, timingDate);
};
