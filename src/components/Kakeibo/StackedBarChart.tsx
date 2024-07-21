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
import { PurchaseDataType } from "../../types/purchaseTypes";

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

const StackedBarChart = ({ purchaseList, title }: DoughnutChartProps) => {
  const categories = [...new Set(purchaseList.map((p) => p.category))];

  const categoryTotals = categories.map((category) => {
    return purchaseList
      .filter((p) => p.category === category)
      .reduce((sum, p) => sum + Math.abs(p.difference), 0);
  });

  const getColor = (index: number) => {
    return `rgba(${index * 30}, ${index * 60}, ${index * 60}, 0.5)`;
  };

  const totalData = categories.map((category, index) => ({
    label: category,
    data: [categoryTotals[index]],
    backgroundColor: getColor(index),
  }));

  const detailData = purchaseList.map((p) => ({
    label: p.title,
    data: [Math.abs(p.difference)],
    backgroundColor: getColor(categories.indexOf(p.category)),
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

  const options = {
    indexAxis: "y",
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
  };

  return <Bar data={combinedData} options={options} />;
};

export default StackedBarChart;
