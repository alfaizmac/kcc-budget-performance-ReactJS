import React, { useRef } from "react";
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
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

function BarGraphRevenue({ tableData, headers }) {
  const chartRef = useRef(null); // Reference to the chart instance

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
        label: "Actual",
        data: totalActualPerMonth,
        backgroundColor: "#51c1cd",
      },
      {
        label: "Budget",
        data: totalBudgetPerMonth,
        backgroundColor: "#316efa",
      },
    ],
  };

  // Chart Options with Zoom
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#141414",
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            // Ensure correct number formatting for hover tooltip
            const dataset = chartData.datasets[tooltipItem.datasetIndex];
            return `${dataset.label}: ${tooltipItem.raw.toLocaleString()}`;
          },
        },
        bodyFont: { size: 16 },
        titleFont: { size: 16 },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy", // Enable both horizontal and vertical panning
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl", // Requires Ctrl key to zoom
          },
          pinch: {
            enabled: true,
          },
          mode: "y", // Enable vertical zoom
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#141414",
          font: { size: 16 },
        },
      },
      y: {
        ticks: {
          color: "#141414",
          font: { size: 16 },
        },
        beginAtZero: true, // Ensure Y-axis starts from zero
        grid: {
          drawBorder: false,
          drawTicks: false,
          color: (context) =>
            context.tick.value === 0 ? "#474747" : "#e0e0e0",
          lineWidth: (context) => (context.tick.value === 0 ? 2 : 1), // Thicker line for zero
        },
      },
    },
  };

  // Function to Reset Zoom
  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        marginBottom: "0px",
        position: "relative",
      }}
    >
      {/* Title with Reset Zoom Button */}
      <div className="title-text-revenue">
        <h2>Revenue (Actual vs Budget)</h2>
        <button className="reset-zoom-btn" onClick={resetZoom}>
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.95 11a8 8 0 1 0-.5 4"></path>
            <path d="M19.95 20v-5h-5"></path>
          </svg>
        </button>
      </div>

      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

export default BarGraphRevenue;
