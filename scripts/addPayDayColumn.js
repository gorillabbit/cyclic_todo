import { db } from './firebase.js';
import { addMonths, lastDayOfMonth } from 'date-fns';

const getPayLaterDate = (baseDate, dateNum) => {
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

async function updateDocuments() {
    const collectionRef = db.collection('Purchases');
    const snapshot = await collectionRef.orderBy('date', 'asc').get();

    if (snapshot.empty) {
        return console.error('データがありません');
    }

    const batch = db.batch();

    const purchases = await Promise.all(
        snapshot._docs().map(async (docSnap) => {
            const docRef = collectionRef.doc(docSnap.id);
            const doc = await docRef.get();
            return { id: docRef.id, ...doc.data(), docRef };
        })
    );

    purchases.forEach((data) => {
        if (!data.tab_id) return;

        batch.update(data.docRef, {
            payDate:
                data.method.timing === '即時'
                    ? data.date
                    : getPayLaterDate(data.date.toDate(), data.method.timing_date),
        });
    });
    await batch.commit();
}

updateDocuments();

async function deleteChildPurchase() {
    const collectionRef = db.collection('Purchases');
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
        return console.error('データがありません');
    }

    const purchases = await Promise.all(
        snapshot._docs().map(async (docSnap) => {
            const docRef = collectionRef.doc(docSnap.id);
            const doc = await docRef.get();
            return { id: docRef.id, ...doc.data(), docRef };
        })
    );

    purchases.forEach((data) => {
        if (!data.childPurchaseId && data.method.timing === '翌月') {
            console.log(data);
            const childPurchaseRef = collectionRef.doc(data.id);
            childPurchaseRef.delete();
        }
    });
}

deleteChildPurchase();
