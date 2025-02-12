import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Modal from "./Modal";
import FilterSection from "./FilterSection";
import VarianceAnalysis from "./VarianceAnalysis";
import FourContainer from "./FourContainer";
import MonthlyRevenueExpenses from "./MonthlyRevenueExpenses";
import TwoPieChart from "./TwoPieChart";

function Dashboard() {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ous, setOUs] = useState([]); // Holds unique OUs
  const [selectedOU, setSelectedOU] = useState(""); // Holds selected OU

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

      <br />
      <FilterSection
        ous={ous}
        selectedOU={selectedOU}
        setSelectedOU={setSelectedOU}
      />
      <br />
      <VarianceAnalysis chartData={chartData} />
      <br />
      <FourContainer />
      <br />
      <br />
      <MonthlyRevenueExpenses chartData={chartData} />
      <br />
      <br />

      {/* Pass selectedOU to TwoPieChart */}
      <TwoPieChart spreadsheetData={fetchedData} selectedOU={selectedOU} />

      <br />
      <br />
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setCenters={setCenters}
        setOUs={setOUs}
      />
    </div>
  );
}

export default Dashboard;
