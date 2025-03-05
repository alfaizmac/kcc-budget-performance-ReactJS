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

function BarGraph({ data }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Actual",
        data: data.map((d) => d.actual),
        backgroundColor: "#316efa",
      },
      {
        label: "Budget",
        data: data.map((d) => d.budget),
        backgroundColor: "#013aa6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Monthly Budget vs Actual",
        font: {
          size: 18,
        },
        color: "black",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "black",
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          color: "black",
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BarGraph;
