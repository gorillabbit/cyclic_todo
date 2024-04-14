import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box } from "@mui/material";
import { PurchaseListType } from "../../types";
Chart.register(ArcElement, Tooltip, Legend, Title);

type DoughnutChartProps = {
  purchaseList: PurchaseListType[];
  title: string;
};

// カテゴリ毎の金額を計算する関数
const aggregateDataByCategory = (data: PurchaseListType[]) => {
  const categoryTotals: { [category: string]: number } = {};

  data.forEach((purchase) => {
    if (categoryTotals[purchase.category]) {
      categoryTotals[purchase.category] += Number(purchase.price);
    } else {
      categoryTotals[purchase.category] = Number(purchase.price);
    }
  });

  return categoryTotals;
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  purchaseList,
  title,
}) => {
  const categoryTotals = aggregateDataByCategory(purchaseList);
  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)", // 他にも必要に応じて色を追加
        ],
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <Box width="500px" height="500px">
      <Doughnut data={data} options={options} />
    </Box>
  );
};

export default DoughnutChart;
