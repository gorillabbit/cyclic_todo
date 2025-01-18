import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import { generateColor, makeCategorySet } from "./ChartUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DoughnutChartProps {
  purchaseList: PurchaseDataType[];
  title: string;
}

const useChartData = (purchaseList: PurchaseDataType[]) => {
  const sortedPurchaseList = purchaseList.sort((a, b) =>
    a.category.localeCompare(b.category)
  );
  const categories = makeCategorySet(sortedPurchaseList);

  const totalData = categories.map((category, index) => ({
    label: category,
    data: [
      sortedPurchaseList
        .filter((p) => p.category === category)
        .reduce((sum, p) => sum + Math.abs(p.difference), 0),
      0,
    ],
    backgroundColor: generateColor(index),
    borderColor: "white",
    borderWidth: 1,
  }));

  const detailData = sortedPurchaseList.map((p) => ({
    label: p.title,
    data: [0, Math.abs(p.difference)],
    backgroundColor: generateColor(categories.indexOf(p.category)),
    borderColor: "white",
    borderWidth: 1,
  }));

  const combinedData = {
    labels: ["合計", "詳細"],
    datasets: [...totalData, ...detailData],
  };

  return combinedData;
};

const StackedBarChart: React.FC<DoughnutChartProps> = ({
  purchaseList,
  title,
}) => {
  const combinedData = useChartData(purchaseList);

  const options = {
    indexAxis: "y" as const,
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  };

  return (
    <Box width="100%" height={150}>
      <Bar data={combinedData} options={options} />
    </Box>
  );
};

export default StackedBarChart;
