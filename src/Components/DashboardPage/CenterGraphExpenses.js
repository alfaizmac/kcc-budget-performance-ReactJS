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
  const [selectedSubAccount, setSelectedSubAccount] = useState(null);

  if (!tableData || !headers || !selectedOU) return null;

  const centerIndex = headers.indexOf("Center");
  const subAccountIndex = headers.indexOf("Sub-Account");

  if (centerIndex === -1 || subAccountIndex === -1) return null;

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

  // **Step 2: Get Sub-Account Data When Clicking Center**
  let subAccountData = {};
  if (selectedCenter) {
    const subAccountRows = tableData.filter(
      (row) =>
        row[centerIndex] === selectedCenter &&
        row[headers.indexOf("OU")] === selectedOU
    );

    subAccountRows.forEach((row) => {
      const subAccountName = row[subAccountIndex];
      if (!subAccountData[subAccountName]) {
        subAccountData[subAccountName] = { budget: 0, actual: 0 };
      }

      headers.forEach((header, index) => {
        if (header.includes("_Budget")) {
          subAccountData[subAccountName].budget += parseFloat(row[index]) || 0;
        }
        if (header.includes("_Actual")) {
          subAccountData[subAccountName].actual += parseFloat(row[index]) || 0;
        }
      });
    });
  }

  const subAccountLabels = Object.keys(subAccountData);
  const subAccountBudgetData = subAccountLabels.map(
    (subAccount) => subAccountData[subAccount].budget
  );
  const subAccountActualData = subAccountLabels.map(
    (subAccount) => subAccountData[subAccount].actual
  );

  // **Step 3: Get Monthly Breakdown When Clicking Sub-Account**
  let monthlyData = {};
  if (selectedCenter && selectedSubAccount) {
    const monthlyRows = tableData.filter(
      (row) =>
        row[centerIndex] === selectedCenter &&
        row[subAccountIndex] === selectedSubAccount &&
        row[headers.indexOf("OU")] === selectedOU
    );

    // Initialize monthly data for each month
    months.forEach((month) => {
      monthlyData[month] = { budget: 0, actual: 0 };
    });

    // Aggregate monthly budget and actual values for the selected center and sub-account
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

  // Sort centerLabels, subAccountLabels, and monthlyLabels alphabetically
  const sortedCenterLabels = centerLabels.sort();
  const sortedBudgetData = sortedCenterLabels.map(
    (center) => centerData[center].budget
  );
  const sortedActualData = sortedCenterLabels.map(
    (center) => centerData[center].actual
  );

  const sortedSubAccountLabels = subAccountLabels
    .filter((subAccount) => subAccount !== "Null")
    .sort();
  const sortedSubAccountBudgetData = sortedSubAccountLabels.map(
    (subAccount) => subAccountData[subAccount].budget
  );
  const sortedSubAccountActualData = sortedSubAccountLabels.map(
    (subAccount) => subAccountData[subAccount].actual
  );

  const sortedMonthlyLabels = monthlyLabels;
  const sortedMonthlyBudgetData = sortedMonthlyLabels.map(
    (month) => monthlyData[month].budget
  );
  const sortedMonthlyActualData = sortedMonthlyLabels.map(
    (month) => monthlyData[month].actual
  );

  // Use sorted labels and data in the chart
  const chartData = selectedSubAccount
    ? {
        labels: sortedMonthlyLabels,
        datasets: [
          {
            label: "Actual Expenses",
            data: sortedMonthlyActualData,
            backgroundColor: "#dd0000",
            borderColor: "#dd0000",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: "Budget Expenses",
            data: sortedMonthlyBudgetData,
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
        labels: sortedSubAccountLabels,
        datasets: [
          {
            label: "Actual Expenses",
            data: sortedSubAccountActualData,
            backgroundColor: "#dd0000",
            borderColor: "#dd0000",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: "Budget Expenses",
            data: sortedSubAccountBudgetData,
            backgroundColor: "#fca44a",
            borderColor: "#fca44a",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
        ],
      }
    : {
        labels: sortedCenterLabels,
        datasets: [
          {
            label: "Actual Expenses",
            data: sortedActualData,
            backgroundColor: "#dd0000",
            borderColor: "#dd0000",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: "Budget Expenses",
            data: sortedBudgetData,
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
        if (selectedSubAccount) {
          setSelectedSubAccount(null);
        } else if (selectedCenter) {
          setSelectedSubAccount(subAccountLabels[clickedIndex]);
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
          {/* Hide back button if selectedCenter is null (only centers displayed) */}
          {(selectedCenter || selectedSubAccount) && (
            <button
              className="graph-back-btn"
              onClick={() => {
                if (selectedSubAccount) {
                  setSelectedSubAccount(null); // Go back to the sub-account view
                } else if (selectedCenter) {
                  setSelectedCenter(null); // Go back to the center view
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
          )}

          <h2>
            {selectedSubAccount
              ? `Expenses Breakdown - ${selectedCenter} - ${selectedSubAccount}`
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
