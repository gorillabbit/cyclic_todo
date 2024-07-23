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
} from "recharts";
import { PurchaseDataType } from "../../types/purchaseTypes";
import { usePurchase } from "../../hooks/useData";
import { getNextMonthFirstDay } from "../../utilities/dateUtilities";

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
      p.date < getNextMonthFirstDay() &&
      p.date >= new Date("2024-04-01") &&
      p.category !== "送受金"
  );
  const processData = (purchase: PurchaseDataType[]) => {
    const result: { [key: string]: { [key: string]: number } } = {};

    purchase.forEach(({ date, difference, category }) => {
      const month = date.toISOString().substring(0, 7); // YYYY-MM形式
      if (!result[month]) {
        result[month] = {};
      }
      if (!result[month][category]) {
        result[month][category] = 0;
      }
      result[month][category] += Math.abs(difference);
    });

    return Object.keys(result).map((month) => ({
      date: month,
      ...result[month],
    }));
  };

  const transformedSpent = useMemo(
    () => processData(pastPurchase),
    [pastPurchase]
  );
  // TODO すごいアドホックなのでどうにかする
  const purchaseCategories = pastPurchase.filter((p) => p.category !== "給与");
  const categories = [...new Set(purchaseCategories.map((p) => p.category))];
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={transformedSpent}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip filterNull contentStyle={{ fontSize: 12 }} />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            stackId="a"
            fill={generateColor(index)}
          />
        ))}
        <Bar dataKey={"給与"} stackId="b" fill={generateColor(1)} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyStackedBarChart;
