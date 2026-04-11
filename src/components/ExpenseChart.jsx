import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const categories = [
    "seed",
    "fertilizer",
    "labor",
    "irrigation",
    "pesticide",
    "other",
  ];

  const totals = categories.map((cat) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  );

  const data = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#2196f3",
          "#00bcd4",
          "#e53935",
          "#9e9e9e",
        ],
        hoverOffset: 8,
        borderWidth: 1,
      },
    ],
  };
  if (!expenses.length) return <p>No expenses yet</p>;
  return <Pie data={data} />;
};

export default ExpenseChart;
