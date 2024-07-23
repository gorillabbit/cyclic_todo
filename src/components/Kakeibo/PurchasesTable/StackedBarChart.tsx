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
import { PurchaseDataType } from "../../../types/purchaseTypes";

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
  const sortedPurchaseList = [...purchaseList].sort((a, b) =>
    a.category.localeCompare(b.category)
  );
  const categories = [...new Set(sortedPurchaseList.map((p) => p.category))];

  const generateColor = (index: number) => {
    const r = (index * 300) % 255;
    const g = (index * 600) % 255;
    const b = (index * 900) % 255;
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  const categoryTotals = categories.map((category) =>
    sortedPurchaseList
      .filter((p) => p.category === category)
      .reduce((sum, p) => sum + Math.abs(p.difference), 0)
  );

  const totalData = categories.map((category, index) => ({
    label: category,
    data: [categoryTotals[index]],
    backgroundColor: generateColor(index),
    borderColor: "white",
    borderWidth: 1,
  }));

  const detailData = sortedPurchaseList.map((p) => ({
    label: p.title,
    data: [Math.abs(p.difference)],
    backgroundColor: generateColor(categories.indexOf(p.category)),
    borderColor: "white",
    borderWidth: 1,
  }));

  const combinedData = {
    labels: ["合計", "詳細"],
    datasets: [
      ...totalData.map((dataset) => ({
        ...dataset,
        data: [dataset.data[0], 0],
      })),
      ...detailData.map((dataset) => ({
        ...dataset,
        data: [0, dataset.data[0]],
      })),
    ],
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
