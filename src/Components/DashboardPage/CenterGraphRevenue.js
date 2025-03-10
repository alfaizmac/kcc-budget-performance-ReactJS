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

function CenterGraphRevenue({ tableData, headers, selectedOU }) {
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
  const revenueRows = tableData.filter(
    (row) =>
      row[subAccountIndex] === "Null" &&
      row[headers.indexOf("OU")] === selectedOU
  );

  let centerData = {};
  revenueRows.forEach((row) => {
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

  // **Step 2: Get Revenue Categories When Clicking Center**
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
        categoryName.startsWith("Wholesale") ||
        categoryName.startsWith("Retail") ||
        categoryName.startsWith("Concession") ||
        categoryName.startsWith("Lease Income") ||
        categoryName.startsWith("Other Income")
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
  } else if (selectedCenter) {
    // Handle when only the center is selected
    const categoryRows = tableData.filter(
      (row) =>
        row[centerIndex] === selectedCenter &&
        row[headers.indexOf("OU")] === selectedOU
    );

    // Initialize monthly data for each month
    months.forEach((month) => {
      monthlyData[month] = { budget: 0, actual: 0 };
    });

    // Aggregate monthly budget and actual values for each account under the selected center
    categoryRows.forEach((row) => {
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
  // Sort centerLabels, categoryLabels, and monthlyLabels alphabetically
  const sortedCenterLabels = centerLabels.sort();
  const sortedBudgetData = sortedCenterLabels.map(
    (center) => centerData[center].budget
  );
  const sortedActualData = sortedCenterLabels.map(
    (center) => centerData[center].actual
  );

  const sortedCategoryLabels = categoryLabels.sort();
  const sortedCategoryBudgetData = sortedCategoryLabels.map(
    (category) => categoryData[category].budget
  );
  const sortedCategoryActualData = sortedCategoryLabels.map(
    (category) => categoryData[category].actual
  );

  const sortedMonthlyLabels = monthlyLabels.sort();
  const sortedMonthlyBudgetData = sortedMonthlyLabels.map(
    (month) => monthlyData[month].budget
  );
  const sortedMonthlyActualData = sortedMonthlyLabels.map(
    (month) => monthlyData[month].actual
  );

  // Use sorted labels and data in the chart
  const chartData = selectedAccount
    ? {
        labels: sortedMonthlyLabels,
        datasets: [
          {
            label: "Actual Revenue",
            data: sortedMonthlyActualData,
            backgroundColor: "#51c1cd", // Background color for line chart
            borderColor: "#51c1cd", // Line color
            borderWidth: 2,
            fill: false, // Do not fill the area under the line
            tension: 0.4, // Adjust the tension to make the line smooth
            pointRadius: 4, // Radius of points on the line (adjust for clarity)
            pointBackgroundColor: "#51c1cd", // Point color
          },
          {
            label: "Budget Revenue",
            data: sortedMonthlyBudgetData,
            backgroundColor: "#316efa", // Background color for line chart
            borderColor: "#316efa", // Line color
            borderWidth: 2,
            fill: false, // Do not fill the area under the line
            tension: 0.4, // Adjust the tension to make the line smooth
            pointRadius: 4, // Radius of points on the line (adjust for clarity)
            pointBackgroundColor: "#316efa", // Point color
          },
        ],
      }
    : selectedCenter
    ? {
        labels: sortedCategoryLabels,
        datasets: [
          {
            label: "Actual Revenue",
            data: sortedCategoryActualData,
            backgroundColor: "#51c1cd", // Background color for line chart
            borderColor: "#51c1cd", // Line color
            borderWidth: 2,
            fill: false, // Do not fill the area under the line
            tension: 0.4, // Adjust the tension to make the line smooth
            pointRadius: 4, // Radius of points on the line (adjust for clarity)
            pointBackgroundColor: "#51c1cd", // Point color
          },
          {
            label: "Budget Revenue",
            data: sortedCategoryBudgetData,
            backgroundColor: "#316efa", // Background color for line chart
            borderColor: "#316efa", // Line color
            borderWidth: 2,
            fill: false, // Do not fill the area under the line
            tension: 0.4, // Adjust the tension to make the line smooth
            pointRadius: 4, // Radius of points on the line (adjust for clarity)
            pointBackgroundColor: "#316efa", // Point color
          },
        ],
      }
    : {
        labels: sortedCenterLabels,
        datasets: [
          {
            label: "Actual Revenue",
            data: sortedActualData,
            backgroundColor: "#51c1cd", // Background color for line chart
            borderColor: "#51c1cd", // Line color
            borderWidth: 2,
            fill: false, // Do not fill the area under the line
            tension: 0.4, // Adjust the tension to make the line smooth
            pointRadius: 4, // Radius of points on the line (adjust for clarity)
            pointBackgroundColor: "#51c1cd", // Point color
          },
          {
            label: "Budget Revenue",
            data: sortedBudgetData,
            backgroundColor: "#316efa", // Background color for line chart
            borderColor: "#316efa", // Line color
            borderWidth: 2,
            fill: false, // Do not fill the area under the line
            tension: 0.4, // Adjust the tension to make the line smooth
            pointRadius: 4, // Radius of points on the line (adjust for clarity)
            pointBackgroundColor: "#316efa", // Point color
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
      <div className="title-text-revenue">
        <div className="title-container">
          {/* Show the back button only if selectedCenter is set */}
          {(selectedCenter || selectedAccount) && (
            <button
              className="graph-back-btn"
              onClick={() => {
                if (selectedAccount) {
                  // Go back to the account view (showing all accounts for the selected center)
                  setSelectedAccount(null);
                } else if (selectedCenter) {
                  // Go back to the center view (showing all centers)
                  setSelectedCenter(null);
                }
              }}
            >
              <svg
                width="32"
                height="32"
                fill="#ffffff"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m10.828 11.997 4.95 4.95-1.414 1.414L8 11.997l6.364-6.364 1.414 1.414-4.95 4.95Z"></path>
              </svg>
            </button>
          )}

          <h2>
            {selectedAccount
              ? `Revenue Breakdown - ${selectedCenter} - ${selectedAccount}`
              : selectedCenter
              ? `Revenue Breakdown - ${selectedCenter}`
              : "Revenue by Center (Total)"}
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
            <div className="dropdown-panel-revenue">
              <button
                className={`dropdown-option-revenue ${
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
                className={`dropdown-option-revenue ${
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

export default CenterGraphRevenue;
