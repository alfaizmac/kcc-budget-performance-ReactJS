import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Modal from "./Modal";
import { fetchSpreadsheetData, getUniqueCenters } from "./fetchSpreadsheetData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const [centers, setCenters] = useState([]);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFetchData = async () => {
    if (!spreadsheetUrl) return;
    try {
      const data = await fetchSpreadsheetData(spreadsheetUrl);
      setFetchedData(data);
      const uniqueCenters = getUniqueCenters(data);
      setCenters(uniqueCenters);
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error);
    }
  };

  useEffect(() => {
    if (selectedCenter && fetchedData.length > 0) {
      const headers = fetchedData[0];
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const centerIndex = 4;
      const filteredData = fetchedData.filter(
        (row) => row[centerIndex] === selectedCenter
      );

      const monthlyData = monthNames.map((month) => {
        const budgetIndex = headers.indexOf(`${month}_Budget`);
        const actualIndex = headers.indexOf(`${month}_Actual`);
        const varianceIndex = headers.indexOf(`${month}_Variance`);

        const totalBudget = filteredData.reduce(
          (sum, row) => sum + (parseFloat(row[budgetIndex]) || 0),
          0
        );
        const totalActual = filteredData.reduce(
          (sum, row) => sum + (parseFloat(row[actualIndex]) || 0),
          0
        );
        const totalVariance = filteredData.reduce(
          (sum, row) => sum + (parseFloat(row[varianceIndex]) || 0),
          0
        );

        return {
          name: month,
          budget: totalBudget,
          actual: totalActual,
          variance: totalVariance,
        };
      });

      setChartData(monthlyData);
    }
  }, [selectedCenter, fetchedData]);

  const pieData = [
    { name: "Revenue", value: 400000 },
    { name: "Expenses", value: 300000 },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="dashboard">
      <h1>Overview</h1>
      {/* Filter Section */}
      <div className="filter-section">
        <svg
          width="30"
          height="30"
          fill="#2a5ed4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m4.08 4 6.482 8.101a2 2 0 0 1 .438 1.25V20l2-1.5v-5.15a2 2 0 0 1 .438-1.249L19.92 4H4.08Zm0-2h15.84a2 2 0 0 1 1.56 3.25L15 13.35v5.15a2 2 0 0 1-.8 1.6l-2 1.5A1.999 1.999 0 0 1 9 20v-6.65l-6.481-8.1A2 2 0 0 1 4.079 2Z"></path>
        </svg>
        <label>Filter</label>
        <select name="OU" id="">
          <option value="">Select OU</option>
        </select>
        <select name="" id="">
          <option value="">Select Revenue/Expenses</option>
        </select>
        <select name="" id="">
          <option value="">Select Account</option>
        </select>
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
        >
          <option value="" disabled>
            Select Center
          </option>
          {centers.map((center, index) => (
            <option key={index} value={center}>
              {center}
            </option>
          ))}
        </select>
        <select name="" id="">
          <option value="">Select Sub-Account</option>
        </select>
        <select name="" id="">
          <option value="">Select Year</option>
        </select>
      </div>
      <br />
      <div className="variance-analysis-container">
        {/* Overall Analytics Graph */}
        <h2>Variance Analysis</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#ff7f0e"
                strokeWidth={3}
                name="Budget"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2ca02c"
                strokeWidth={3}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="variance"
                stroke="#d62728"
                strokeWidth={3}
                name="Variance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Floating Button for Opening Modal */}
      <div className="tooltip-container">
        <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
          <svg
            width="100"
            height="100"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2ZM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5Z"></path>
          </svg>
        </button>
        <span className="tooltip-text">
          Upload your Excel file <br /> or input a link here
        </span>
      </div>
      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <br />
      {/* four Containers */}
      <div className="four-containers">
        <div className="total-revenue-container">
          <h3>Total Revenue</h3>
          <h2>000,000,000,000</h2>
        </div>
        <div className="total-expense-container">
          <h3>Total Expenses</h3>
          <h2>000,000,000,000</h2>
        </div>
        <div className="total-budget-container">
          <h3>Total Budget</h3>
          <h2>000,000,000,000</h2>
        </div>
        <div className="total-actual-container">
          <h3>Total Actual</h3>
          <h2>000,000,000,000</h2>
        </div>
      </div>
      <br />
      <br />
      <div className="montly-revenue-expenses-container">
        <h2>Monthly Revenue vs. Expenses</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#ff7f0e"
                strokeWidth={3}
                name="Budget"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2ca02c"
                strokeWidth={3}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="variance"
                stroke="#d62728"
                strokeWidth={3}
                name="Variance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <br />
      <br />
      {/* Two Pie Charts Container */}
      <div className="two-pie-charts-container">
        <div className="pie-chart">
          <h2 className="chart-title">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pie-chart">
          <h2 className="chart-title">Expenses Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
}

export default Dashboard;
