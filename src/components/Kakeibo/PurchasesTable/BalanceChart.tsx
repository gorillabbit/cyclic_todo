import { useAsset, usePurchase } from "../../../hooks/useData";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Brush,
} from "recharts";
import { format, set } from "date-fns";
import { getFutureMonthFirstDay } from "../../../utilities/dateUtilities";

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
    (p) =>
      p.date < getFutureMonthFirstDay(2) && p.date >= new Date("2024-04-01")
  );
  const { assetList } = useAsset();
  // 全ての日付を取得し、ユニークかつソートする
  const dates = lastPurchase.map((p) => p.date);
  dates.sort(); // 日付をソート

  // データセットを作成
  const datasets = lastPurchase
    .map((p, index) => {
      const asset = assetList.find((asset) => asset.id === p.assetId);
      if (!asset) return;
      return {
        time: set(p.date, {
          milliseconds: index, // データが更新されるとき、同じ時刻のデータが大量に作成される問題があるので暫定的解決策　TODO: 修正
        }).getTime(),
        [asset.name]: p.balance,
      };
    })
    .filter((data) => data);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart width={500} height={300} data={datasets}>
        <XAxis
          dataKey="time"
          tickFormatter={(t) => format(t, "MM月dd日")}
          type="number"
          scale="time"
          domain={["auto", "auto"]}
          tick={{ fontSize: 12 }}
        />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip
          filterNull
          cursor={{ stroke: "red", strokeWidth: 0.5 }}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Brush />
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
