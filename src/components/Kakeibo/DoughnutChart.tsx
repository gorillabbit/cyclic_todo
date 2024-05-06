import React, { memo, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartData,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DoughnutControllerChartOptions,
} from "chart.js";
import { Box } from "@mui/material";
import { PurchaseListType } from "../../types";
import { _DeepPartialObject } from "chart.js/dist/types/utils";

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

type plainDoughnutChartProps = {
  data: ChartData<"doughnut", number[], unknown>;
  options:
    | _DeepPartialObject<
        CoreChartOptions<"doughnut"> &
          ElementChartOptions<"doughnut"> &
          PluginChartOptions<"doughnut"> &
          DatasetChartOptions<"doughnut"> &
          DoughnutControllerChartOptions
      >
    | undefined;
};

const PlainDoughnutChart = memo(
  (props: plainDoughnutChartProps): JSX.Element => (
    <Box width="100%" maxWidth="500px" my={2}>
      <Doughnut data={props.data} options={props.options} />
    </Box>
  )
);

const DoughnutChart = memo((props: DoughnutChartProps): JSX.Element => {
  const data = useMemo(() => {
    const categoryTotals: Record<string, { price: number; color: string }> = {};
    props.purchaseList.forEach(({ category, price }, index) => {
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
    const subData = props.purchaseList
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
  }, [props.purchaseList]);

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
        text: props.title,
      },
    },
  };

  const plainProps = {
    data,
    options,
  };

  return <PlainDoughnutChart {...plainProps} />;
});

export default DoughnutChart;
