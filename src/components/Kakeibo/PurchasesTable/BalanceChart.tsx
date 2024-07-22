import { useAsset, usePurchase } from "../../../hooks/useData";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { getNextMonthFirstDay } from "../../../utilities/dateUtilities";

// インデックスに基づいた色を生成する関数
const getColorByIndex = (index: number) => {
  const r = (index * 50) % 255;
  const g = (index * 100) % 255;
  const b = (index * 150) % 255;
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

const BalanceChart = () => {
  const { purchaseList } = usePurchase();
  const lastPurchase = purchaseList.filter(
    (p) => p.date < getNextMonthFirstDay() && p.date >= new Date("2024-04-01")
  );
  const { assetList } = useAsset();
  // 全ての日付を取得し、ユニークかつソートする
  const dates = lastPurchase.map((p) => p.date);
  dates.sort(); // 日付をソート

  // データセットを作成
  const datasets = lastPurchase.map((p) => {
    const asset = assetList.find((asset) => asset.id === p.assetId);
    if (!asset) return {};
    return {
      time: p.date.getTime(),
      [asset.name]: p.balance,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart width={500} height={300} data={datasets}>
        <XAxis
          dataKey="time"
          tickFormatter={(t) => format(t, "MM月dd日")}
          type="number"
          scale="time"
          domain={["auto", "auto"]}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {assetList.map((asset, index) => (
          <Line
            type="monotone"
            dataKey={asset.name}
            stroke={getColorByIndex(index)}
            key={asset.id}
            connectNulls
            activeDot={{ r: 6 }}
            dot={{ r: 1 }}
            strokeWidth={2}
            yAxisId={asset.name === "SMBC" ? "left" : "right"}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
