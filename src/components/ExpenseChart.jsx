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
          "#22c55e",
          "#f59e0b",
          "#3b82f6",
          "#06b6d4",
          "#ef4444",
          "#9ca3af",
        ],
        borderWidth: 0,
      },
    ],
  };

  if (!expenses.length)
    return <p className="text-sm text-gray-400 text-center">No expenses yet</p>;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-300">
        Expense Breakdown
      </h3>

      <div className="max-w-xs mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default ExpenseChart;
