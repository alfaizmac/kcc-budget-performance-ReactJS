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

function CenterGraphRevenue({ tableData, headers, selectedOU }) {
  const chartRef = useRef(null); // Reference for resetting zoom

  if (!tableData || !headers || !selectedOU) return null;

  // Identify required column indexes
  const centerIndex = headers.indexOf("Center");
  const subAccountIndex = headers.indexOf("Sub-Account");

  // Ensure columns exist
  if (centerIndex === -1 || subAccountIndex === -1) return null;

  // Filter Revenue Rows (where Sub-Account is "Null" and belongs to selected OU)
  const revenueRows = tableData.filter(
    (row) =>
      row[subAccountIndex] === "Null" &&
      row[headers.indexOf("OU")] === selectedOU
  );

  // Initialize Center Data
  let centerData = {};

  // Process data row by row
  revenueRows.forEach((row) => {
    const centerName = row[centerIndex];

    if (!centerData[centerName]) {
      centerData[centerName] = { budget: 0, actual: 0 };
    }

    // Sum up all months' Budget and Actual
    headers.forEach((header, index) => {
      if (header.includes("_Budget")) {
        centerData[centerName].budget += parseFloat(row[index]) || 0;
      }
      if (header.includes("_Actual")) {
        centerData[centerName].actual += parseFloat(row[index]) || 0;
      }
    });
  });

  // Convert Data into ChartJS Format
  const centerLabels = Object.keys(centerData);
  const budgetData = centerLabels.map((center) => centerData[center].budget);
  const actualData = centerLabels.map((center) => centerData[center].actual);

  // Chart Data
  const chartData = {
    labels: centerLabels,
    datasets: [
      {
        label: "Actual Revenue",
        data: actualData,
        backgroundColor: "#51c1cd",
      },
      {
        label: "Budget Revenue",
        data: budgetData,
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
          mode: "xy",
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl",
          },
          pinch: {
            enabled: true,
          },
          mode: "y",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#141414",
          font: { size: 14 },
        },
      },
      y: {
        ticks: {
          color: "#141414",
          font: { size: 14 },
        },
        beginAtZero: true,
        grid: {
          drawBorder: false,
          drawTicks: false,
          color: (context) =>
            context.tick.value === 0 ? "#474747" : "#e0e0e0",
          lineWidth: (context) => (context.tick.value === 0 ? 3 : 1), // Thicker line for zero
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
        height: "650px",
        marginBottom: "20px",
        position: "relative",
      }}
    >
      {/* Title with Reset Zoom Button */}
      <div className="title-text-revenue">
        <h2>Revenue by Center (Total)</h2>
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

export default CenterGraphRevenue;
