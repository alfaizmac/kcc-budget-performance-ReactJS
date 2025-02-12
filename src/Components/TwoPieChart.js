import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
];

function TwoPieChart({ spreadsheetData, selectedOU }) {
  const [revenueData, setRevenueData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    console.log("Spreadsheet Data:", spreadsheetData);
    console.log("Selected OU:", selectedOU);

    if (!spreadsheetData || spreadsheetData.length === 0 || !selectedOU) return;

    // Step 1: Filter data based on selected OU
    const filteredData = spreadsheetData.filter((row) => row.OU === selectedOU);
    console.log("Filtered Data:", filteredData);

    if (filteredData.length === 0) {
      setRevenueData([]);
      setExpenseData([]);
      return;
    }

    // Step 2: Process Revenue and Expenses separately
    const revenueMap = {};
    const expenseMap = {};

    filteredData.forEach((row) => {
      const center = row.Center;

      if (!revenueMap[center]) revenueMap[center] = 0;
      if (!expenseMap[center]) expenseMap[center] = 0;

      // Sum all "Actual" values for Revenue and Expenses (Jan-Dec)
      Object.keys(row).forEach((key) => {
        if (key.includes("_Actual")) {
          revenueMap[center] += Number(row[key]) || 0;
        }
        if (key.includes("_Budget")) {
          expenseMap[center] += Number(row[key]) || 0;
        }
      });
    });

    console.log("Revenue Data:", revenueMap);
    console.log("Expense Data:", expenseMap);

    // Format data for Pie Charts
    const formattedRevenueData = Object.keys(revenueMap)
      .filter((center) => revenueMap[center] > 0)
      .map((center) => ({
        name: `${center} (${revenueMap[center].toLocaleString()})`,
        value: revenueMap[center],
      }));

    const formattedExpenseData = Object.keys(expenseMap)
      .filter((center) => expenseMap[center] > 0)
      .map((center) => ({
        name: `${center} (${expenseMap[center].toLocaleString()})`,
        value: expenseMap[center],
      }));

    setRevenueData(formattedRevenueData);
    setExpenseData(formattedExpenseData);
  }, [spreadsheetData, selectedOU]);

  return (
    <div className="two-pie-charts-container">
      <div className="pie-chart">
        <h2 className="chart-title">Revenue Breakdown</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
            >
              {revenueData.map((entry, index) => (
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
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
            >
              {expenseData.map((entry, index) => (
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
  );
}

export default TwoPieChart;
