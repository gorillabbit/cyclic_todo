import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box } from "@mui/material";
import { PurchaseListType } from "../../types";

Chart.register(ArcElement, Tooltip, Legend, Title);

const colors = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
  "rgba(255, 159, 64, 0.6)",
  "rgba(199, 199, 199, 0.6)",
];

interface DoughnutChartProps {
  purchaseList: PurchaseListType[];
  title: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  purchaseList,
  title,
}) => {
  const data = useMemo(() => {
    const categoryTotals: Record<string, { price: number; color: string }> = {};
    purchaseList.forEach(({ category, price }, index) => {
      const priceNumber = Number(price);
      if (priceNumber > 0) {
        if (!categoryTotals[category]) {
          categoryTotals[category] = {
            price: 0,
            color: colors[index % colors.length],
          };
        }
        categoryTotals[category].price += priceNumber;
      }
    });

    const categories = Object.keys(categoryTotals);
    const subData = purchaseList
      .sort((a, b) => {
        const indexA = categories.indexOf(a.category);
        const indexB = categories.indexOf(b.category);
        return indexA - indexB;
      })
      .filter((item) => item.price > 0 && categories.includes(item.category));

    return {
      datasets: [
        {
          data: categories.map((category) => categoryTotals[category].price),
          backgroundColor: categories.map(
            (category) => categoryTotals[category].color
          ),
          borderColor: "white",
          borderWidth: 1,
          labels: categories,
        },
        {
          data: subData.map((item) => Number(item.price)),
          backgroundColor: subData.map(
            (item) => categoryTotals[item.category].color
          ),
          borderColor: "white",
          borderWidth: 1,
          labels: subData.map((item) => item.title),
          label: "詳細出費",
        },
      ],
    };
  }, [purchaseList]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.dataset.labels[tooltipItem.dataIndex]}: ${
              tooltipItem.formattedValue
            }`,
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <Box width="100%" maxWidth="500px" my={2}>
      <Doughnut data={data} options={options} />
    </Box>
  );
};

export default DoughnutChart;