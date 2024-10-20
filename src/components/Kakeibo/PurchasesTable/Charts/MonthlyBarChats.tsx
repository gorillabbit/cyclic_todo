import { useMemo } from "react";

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
} from "recharts";
import { usePurchase } from "../../../../hooks/useData";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import { getFutureMonthFirstDay } from "../../../../utilities/dateUtilities";
import { defaultFontSize, fontSizeObj } from "./DefaultConsts";

const generateColor = (index: number) => {
  const r = (index * 300) % 255;
  const g = (index * 600) % 255;
  const b = (index * 900) % 255;
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

const MonthlyStackedBarChart = () => {
  const { purchaseList } = usePurchase();
  const pastPurchase = purchaseList.filter(
    (p) =>
      p.date < getFutureMonthFirstDay(2) &&
      p.date >= new Date("2024-04-01") &&
      p.category !== "送受金"
  );
  const processData = (purchase: PurchaseDataType[]) => {
    const result: {
      [key: string]: { [key: string]: number };
    } = {};

    // 月ごとにカテゴリごとの支出を集計
    purchase.forEach(({ date, difference, category }) => {
      const month = date.toISOString().substring(0, 7); // YYYY-MM形式
      if (!result[month]) {
        result[month] = {};
      }
      if (difference > 0) {
        if (!result[month][category + "_i"]) {
          result[month][category + "_i"] = 0;
        }
        result[month][category + "_i"] += Number(difference);
      } else {
        if (!result[month][category]) {
          result[month][category] = 0;
        }
        result[month][category] += Math.abs(difference);
      }
    });

    // 月ごとに収入を集計
    return Object.keys(result).map((month) => {
      const spentTotal = Object.entries(result[month]).reduce(
        (acc, value) => (!value[0].includes("_i") ? acc + value[1] : acc),
        0
      );
      const incomeTotal = Object.entries(result[month]).reduce(
        (acc, value) => (value[0].includes("_i") ? acc + value[1] : acc),
        0
      );
      return {
        date: month,
        spentTotal,
        incomeTotal,
        ...result[month],
      };
    });
  };

  const transformedSpent = useMemo(
    () => processData(pastPurchase),
    [pastPurchase]
  );

  const spentPurchases = pastPurchase.filter((p) => p.difference < 0);
  const spentCategories = [...new Set(spentPurchases.map((p) => p.category))];

  const incomePurchases = pastPurchase.filter((p) => p.difference > 0);
  const incomeCategories = [...new Set(incomePurchases.map((p) => p.category))];
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
            dataKey={category + "_i"}
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
