import React, { useState, useEffect } from "react";
import FilterSection from "../Components/FilterSection";
import VarianceAnalysis from "../Components/VarianceAnalysis";
import FourContainer from "../Components/FourContainer";
import MonthlyRevenueExpenses from "../Components/MonthlyRevenueExpenses";
import TwoPieChart from "../Components/TwoPieChart";
import UploadButton from "../Components/UploadButton"; // Import UploadButton
import "./Dashboard.css";

function Dashboard() {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ous, setOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState("");

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

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
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
      <MonthlyRevenueExpenses chartData={chartData} />
      <br />
      <TwoPieChart spreadsheetData={fetchedData} selectedOU={selectedOU} />
      <br />

      {/* Upload Button Component */}
      <UploadButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setCenters={setCenters}
        setOUs={setOUs}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
