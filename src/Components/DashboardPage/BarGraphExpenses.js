import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarGraphExpenses({ tableData, headers }) {
  if (!tableData || !headers) return null;

  // Define months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Filter Expense Rows (Sub-Account is NOT "Null")
  const expenseRows = tableData.filter(
    (row) => row[headers.indexOf("Sub-Account")] !== "Null"
  );

  // Initialize Monthly Totals
  let totalBudgetPerMonth = Array(12).fill(0);
  let totalActualPerMonth = Array(12).fill(0);

  // Sum up Budget and Actual values per month
  expenseRows.forEach((row) => {
    months.forEach((month, index) => {
      const budgetIndex = headers.indexOf(`${month}_Budget`);
      const actualIndex = headers.indexOf(`${month}_Actual`);

      if (budgetIndex !== -1 && actualIndex !== -1) {
        totalBudgetPerMonth[index] += parseFloat(row[budgetIndex]) || 0;
        totalActualPerMonth[index] += parseFloat(row[actualIndex]) || 0;
      }
    });
  });

  // Prepare Chart Data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Actual Expenses",
        data: totalActualPerMonth,
        backgroundColor: "#fca44a",
      },
      {
        label: "Budget Expenses",
        data: totalBudgetPerMonth,
        backgroundColor: "#fa7d61",
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#141414",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 16, // Increased font size for tooltip
        },
        titleFont: {
          size: 16, // Increased font size for tooltip title
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#141414",
          font: {
            size: 16,
          },
        },
      },
      y: {
        ticks: {
          color: "#141414",
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px", marginBottom: "0px" }}>
      <div className="title-text-expenses">
        <h2>Expenses (Actual vs Budget)</h2>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BarGraphExpenses;
