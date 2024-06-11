import { memo, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title, ChartData } from "chart.js";
import { Box } from "@mui/material";
import { PurchaseListType } from "../../../types";

Chart.register(ArcElement, Tooltip, Legend, Title);

const colors = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
  "rgba(255, 159, 64, 0.6)",
  "rgba(199, 199, 199, 0.6)",
  "rgba(255, 129, 102, 0.6)",
  "rgba(99, 180, 255, 0.6)",
  "rgba(255, 229, 153, 0.6)",
  "rgba(129, 199, 132, 0.6)",
  "rgba(175, 102, 255, 0.6)",
  "rgba(255, 204, 99, 0.6)",
];

interface DoughnutChartProps {
  purchaseList: PurchaseListType[];
  title: string;
}

interface PlainDoughnutChartProps {
  data: ChartData<"doughnut", number[], unknown>;
  options: any;
}

const PlainDoughnutChart = memo(
  ({ data, options }: PlainDoughnutChartProps): JSX.Element => (
    <Box width="100%" maxWidth="500px" my={2}>
      <Doughnut data={data} options={options} />
    </Box>
  )
);

const DoughnutChart = memo(
  ({ purchaseList, title }: DoughnutChartProps): JSX.Element => {
    const data = useMemo(() => {
      const categoryTotals: Record<string, { price: number; color: string }> =
        {};
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
          },
        ],
      };
    }, [purchaseList]);

    const options = useMemo(
      () => ({
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: {
                dataset: { labels: { [x: string]: any } };
                dataIndex: string | number;
                formattedValue: any;
              }) =>
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
      }),
      [title]
    );

    return <PlainDoughnutChart data={data} options={options} />;
  }
);

export default DoughnutChart;
