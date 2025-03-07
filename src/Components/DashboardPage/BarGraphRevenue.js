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

function BarGraphRevenue({ tableData, headers }) {
  if (!tableData || !headers) return null;

  // Define Months
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

  // Filter Revenue Rows (Sub-Account should be "Null")
  const revenueRows = tableData.filter(
    (row) => row[headers.indexOf("Sub-Account")] === "Null"
  );

  // Initialize Monthly Totals
  let totalBudgetPerMonth = Array(12).fill(0);
  let totalActualPerMonth = Array(12).fill(0);

  // Sum up Budget and Actual values per month
  revenueRows.forEach((row) => {
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
        label: "Actual Revenue",
        data: totalActualPerMonth,
        backgroundColor: "#51c1cd ",
      },
      {
        label: "Budget Revenue",
        data: totalBudgetPerMonth,
        backgroundColor: "#316efa ",
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
      <div className="title-text-revenue">
        <h2>Revenue (Actual vs Budget)</h2>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BarGraphRevenue;
