import React, { useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

function CenterGraphExpenses({ tableData, headers, selectedOU }) {
  const chartRef = useRef(null);
  const [graphType, setGraphType] = useState("bar");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  if (!tableData || !headers || !selectedOU) return null;

  const centerIndex = headers.indexOf("Center");
  const subAccountIndex = headers.indexOf("Sub-Account");
  const accountIndex = headers.indexOf("Account");

  if (centerIndex === -1 || subAccountIndex === -1 || accountIndex === -1)
    return null;

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

  // **Step 1: Get Centers Data**
  const expenseRows = tableData.filter(
    (row) =>
      row[subAccountIndex] !== "Null" &&
      row[headers.indexOf("OU")] === selectedOU
  );

  let centerData = {};
  expenseRows.forEach((row) => {
    const centerName = row[centerIndex];
    if (!centerData[centerName]) {
      centerData[centerName] = { budget: 0, actual: 0 };
    }

    headers.forEach((header, index) => {
      if (header.includes("_Budget")) {
        centerData[centerName].budget += parseFloat(row[index]) || 0;
      }
      if (header.includes("_Actual")) {
        centerData[centerName].actual += parseFloat(row[index]) || 0;
      }
    });
  });

  const centerLabels = Object.keys(centerData);
  const budgetData = centerLabels.map((center) => centerData[center].budget);
  const actualData = centerLabels.map((center) => centerData[center].actual);

  // **Step 2: Get Expense Categories When Clicking Center**
  let categoryData = {};
  if (selectedCenter) {
    const categoryRows = tableData.filter(
      (row) =>
        row[centerIndex] === selectedCenter &&
        row[headers.indexOf("OU")] === selectedOU
    );

    categoryRows.forEach((row) => {
      const categoryName = row[accountIndex];

      if (
        categoryName.startsWith("Selling Expenses") ||
        categoryName.startsWith("Administrative Expenses")
      ) {
        if (!categoryData[categoryName]) {
          categoryData[categoryName] = { budget: 0, actual: 0 };
        }

        headers.forEach((header, index) => {
          if (header.includes("_Budget")) {
            categoryData[categoryName].budget += parseFloat(row[index]) || 0;
          }
          if (header.includes("_Actual")) {
            categoryData[categoryName].actual += parseFloat(row[index]) || 0;
          }
        });
      }
    });
  }

  const categoryLabels = Object.keys(categoryData);
  const categoryBudgetData = categoryLabels.map(
    (category) => categoryData[category].budget
  );
  const categoryActualData = categoryLabels.map(
    (category) => categoryData[category].actual
  );

  // **Step 3: Get Monthly Breakdown When Clicking Account**
  let monthlyData = {};
  if (selectedCenter && selectedAccount) {
    const monthlyRows = tableData.filter(
      (row) =>
        row[centerIndex] === selectedCenter &&
        row[accountIndex] === selectedAccount &&
        row[headers.indexOf("OU")] === selectedOU
    );

    // Initialize monthly data for each month
    months.forEach((month) => {
      monthlyData[month] = { budget: 0, actual: 0 };
    });

    // Aggregate monthly budget and actual values for the selected center and account
    monthlyRows.forEach((row) => {
      months.forEach((month) => {
        const budgetIndex = headers.indexOf(`${month}_Budget`);
        const actualIndex = headers.indexOf(`${month}_Actual`);

        if (budgetIndex !== -1 && actualIndex !== -1) {
          monthlyData[month].budget += parseFloat(row[budgetIndex]) || 0;
          monthlyData[month].actual += parseFloat(row[actualIndex]) || 0;
        }
      });
    });
  }

  const monthlyLabels = Object.keys(monthlyData);
  const monthlyBudgetData = monthlyLabels.map(
    (month) => monthlyData[month].budget
  );
  const monthlyActualData = monthlyLabels.map(
    (month) => monthlyData[month].actual
  );

  // **Step 4: Configure Charts**
  const chartData = selectedAccount
    ? {
        labels: monthlyLabels,
        datasets: [
          {
            label: "Actual Expenses",
            data: monthlyActualData,
            backgroundColor: "#fa7d61",
            borderColor: "#fa7d61",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: "Budget Expenses",
            data: monthlyBudgetData,
            backgroundColor: "#fca44a",
            borderColor: "#fca44a",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
        ],
      }
    : selectedCenter
    ? {
        labels: categoryLabels,
        datasets: [
          {
            label: "Actual Expenses",
            data: categoryActualData,
            backgroundColor: "#fa7d61",
            borderColor: "#fa7d61",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: "Budget Expenses",
            data: categoryBudgetData,
            backgroundColor: "#fca44a",
            borderColor: "#fca44a",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
        ],
      }
    : {
        labels: centerLabels,
        datasets: [
          {
            label: "Actual Expenses",
            data: actualData,
            backgroundColor: "#fa7d61",
            borderColor: "#fa7d61",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: "Budget Expenses",
            data: budgetData,
            backgroundColor: "#fca44a",
            borderColor: "#fca44a",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
        ],
      };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#141414", font: { size: 14 } },
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
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true, modifierKey: "ctrl" },
          pinch: { enabled: true },
          mode: "y",
        },
      },
    },
    scales: {
      x: { ticks: { color: "#141414", font: { size: 14 } } },
      y: { ticks: { color: "#141414", font: { size: 14 } }, beginAtZero: true },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        if (selectedAccount) {
          setSelectedAccount(null);
        } else if (selectedCenter) {
          setSelectedAccount(categoryLabels[clickedIndex]);
        } else {
          setSelectedCenter(centerLabels[clickedIndex]);
        }
      }
    },
  };

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
      <div className="title-text-expenses">
        <div className="title-container">
          <button
            className="graph-back-btn"
            onClick={() => {
              if (selectedAccount) {
                setSelectedAccount(null); // Go back to account view
              } else if (selectedCenter) {
                setSelectedCenter(null); // Go back to center view
              }
            }}
          >
            <svg
              width="58"
              height="58"
              fill="#ffffff"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m10.828 11.997 4.95 4.95-1.414 1.414L8 11.997l6.364-6.364 1.414 1.414-4.95 4.95Z"></path>
            </svg>
          </button>

          <h2>
            {selectedAccount
              ? `Expenses Breakdown - ${selectedCenter} - ${selectedAccount}`
              : selectedCenter
              ? `Expenses Breakdown - ${selectedCenter}`
              : "Expenses by Center (Total)"}
          </h2>
        </div>

        <div className="graph-buttons-container">
          <button className="reset-zoom-btn-center" onClick={resetZoom}>
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            >
              <path d="M19.95 11a8 8 0 1 0-.5 4"></path>
              <path d="M19.95 20v-5h-5"></path>
            </svg>
          </button>

          <button
            className="graph-type-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            >
              <path d="M4 6h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="dropdown-panel-expenses">
              <button
                className={`dropdown-option-expenses ${
                  graphType === "bar" ? "selected" : ""
                }`}
                onClick={() => {
                  setGraphType("bar");
                  setDropdownOpen(false);
                }}
              >
                Bar-Graph
              </button>
              <button
                className={`dropdown-option-expenses ${
                  graphType === "line" ? "selected" : ""
                }`}
                onClick={() => {
                  setGraphType("line");
                  setDropdownOpen(false);
                }}
              >
                Line-Graph
              </button>
            </div>
          )}
        </div>
      </div>

      {graphType === "bar" ? (
        <Bar ref={chartRef} data={chartData} options={options} />
      ) : (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  );
}

export default CenterGraphExpenses;
