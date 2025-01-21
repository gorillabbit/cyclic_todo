import { useMemo } from 'react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import { usePurchase } from '../../../../hooks/useData';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import { getFutureMonthFirstDay } from '../../../../utilities/dateUtilities';
import { defaultFontSize, fontSizeObj } from './DefaultConst';
import { generateColor, makeCategorySet } from './ChartUtils';

const MonthlyStackedBarChart = () => {
    const { purchaseList } = usePurchase();
    const pastPurchase = purchaseList.filter(
        (p) =>
            p.date < getFutureMonthFirstDay(2) &&
            p.date >= new Date('2024-04-01') &&
            p.category !== '送受金'
    );
    const processData = (purchase: PurchaseDataType[]) => {
        const result: {
            [key: string]: { [key: string]: number };
        } = {};

        // 月ごとにカテゴリごとの支出を集計
        purchase.forEach(({ date, difference, category }) => {
            const month = date.toISOString().slice(0, 7); // YYYY-MM形式
            if (!result[month]) {
                result[month] = {};
            }
            const differenceNumber = Math.abs(difference);
            if (difference > 0) {
                const incomeCategory = category + '_i';

                result[month][incomeCategory] =
                    (result[month][incomeCategory] || 0) + differenceNumber;

                result[month].incomeTotal = (result[month].incomeTotal || 0) + differenceNumber;
            } else {
                result[month][category] = (result[month][category] || 0) + differenceNumber;

                result[month].spentTotal = (result[month].spentTotal || 0) + differenceNumber;
            }
        });

        return Object.keys(result).map((month) => ({
            date: month,
            ...result[month],
        }));
    };

    const transformedSpent = useMemo(() => processData(pastPurchase), [pastPurchase]);

    const spentPurchases = pastPurchase.filter((p) => p.difference < 0);
    const spentCategories = makeCategorySet(spentPurchases);

    const incomePurchases = pastPurchase.filter((p) => p.difference > 0);
    const incomeCategories = makeCategorySet(incomePurchases);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={transformedSpent}>
                <CartesianGrid strokeWidth={0.5} />
                <XAxis dataKey="date" tick={fontSizeObj} />
                <YAxis tick={fontSizeObj} />
                <Tooltip filterNull contentStyle={fontSizeObj} />
                <Legend />
                {spentCategories.map((category, index) => (
                    <Bar
                        key={category}
                        dataKey={category}
                        stackId="a"
                        fill={generateColor(index + 1)}
                    >
                        {index === spentCategories.length - 1 && (
                            <LabelList
                                dataKey="spentTotal"
                                position="top"
                                fontSize={defaultFontSize}
                            />
                        )}
                    </Bar>
                ))}
                {incomeCategories.map((category, index) => (
                    <Bar
                        key={category + '_i'}
                        dataKey={category + '_i'}
                        stackId="b"
                        fill={generateColor(index + 1)}
                    >
                        {index === incomeCategories.length - 1 && (
                            <LabelList
                                dataKey="incomeTotal"
                                position="top"
                                fontSize={defaultFontSize}
                            />
                        )}
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MonthlyStackedBarChart;
