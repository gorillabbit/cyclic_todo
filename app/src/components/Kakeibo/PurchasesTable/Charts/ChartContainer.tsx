import { Box } from '@mui/material';
import { memo, useMemo } from 'react';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import {
    is今月の支払いwithout後払いの支払い,
    sumSpentAndIncome,
} from '../../../../utilities/purchaseUtilities';
import BalanceChart from './BalanceChart';
import MonthlyStackedBarChart from './MonthlyBarChats';
import StackedBarChart from './StackedBarChart';

type PlainDoughnutContainerProps = {
    currentMonthNetSpentList: PurchaseDataType[];
    currentMonthNetSpent: number;
    currentMonthPaymentList: PurchaseDataType[];
    currentMonthPayment: number;
    currentMonthPaymentCategoryList: PurchaseDataType[];
    currentMonthIncomeList: PurchaseDataType[];
    currentMonthIncome: number;
};

const PlainDoughnutContainer = memo(
    ({
        currentMonthNetSpentList,
        currentMonthNetSpent,
        currentMonthPaymentList,
        currentMonthPayment,
        currentMonthPaymentCategoryList,
        currentMonthIncomeList,
        currentMonthIncome,
    }: PlainDoughnutContainerProps) => (
        <Box display="flex" flexWrap="wrap" justifyContent="center">
            <StackedBarChart
                purchaseList={currentMonthNetSpentList}
                title={`今月の使用金額 ${-currentMonthNetSpent}円`}
            />
            <StackedBarChart
                purchaseList={currentMonthPaymentList}
                title={`今月の支払い金額 ${-currentMonthPayment}円`}
            />
            <StackedBarChart
                purchaseList={currentMonthPaymentCategoryList}
                title={`今月の支払い金額(支払い方法ごと) ${-currentMonthPayment}円`}
            />
            <StackedBarChart
                purchaseList={currentMonthIncomeList}
                title={`今月の収入金額 ${currentMonthIncome}円`}
            />

            <BalanceChart />
            <MonthlyStackedBarChart />
        </Box>
    )
);
// 全期間の推移グラフも表示する。
const DoughnutContainer = ({
    monthlyPurchases,
    currentMonth,
}: {
    monthlyPurchases: PurchaseDataType[];
    currentMonth: Date;
}) => {
    const PurchasesWithoutTransfer = useMemo(
        () => monthlyPurchases.filter((p) => p.category !== '送受金'),
        [monthlyPurchases]
    );

    const currentMonthSpentList = PurchasesWithoutTransfer.filter((p) => p.difference < 0);

    // 今月使った金額を示す。カードの支払は含まない
    const currentMonthNetSpentList = currentMonthSpentList.filter((spent) =>
        is今月の支払いwithout後払いの支払い(spent, currentMonth)
    );
    const currentMonthNetSpent = sumSpentAndIncome(currentMonthNetSpentList);

    // 今月の支払金額(カテゴリーごと)(カード払いをまとめる)
    const currentMonthPaymentList = currentMonthSpentList.filter(
        (spent) => spent.payDate.getMonth() === currentMonth.getMonth()
    );
    const currentMonthPayment = sumSpentAndIncome(currentMonthPaymentList);

    // 今月の支払金額(支払い方法ごと)
    const currentMonthPaymentCategoryList = currentMonthPaymentList.map((p) => ({
        ...p,
        category: p.method.label,
    }));

    const currentMonthIncomeList = PurchasesWithoutTransfer.filter((p) => p.difference > 0);
    const currentMonthIncome = sumSpentAndIncome(currentMonthIncomeList);

    const plainProps = {
        currentMonthNetSpentList,
        currentMonthNetSpent,
        currentMonthPaymentList,
        currentMonthPayment,
        currentMonthPaymentCategoryList,
        currentMonthIncomeList,
        currentMonthIncome,
    };
    // TODO 円グラフじゃなくて棒グラフに変更する
    return <PlainDoughnutContainer {...plainProps} />;
};

export default DoughnutContainer;
