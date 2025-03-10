import React, { useState, useEffect } from "react";
import UploadButton from "../UploadButton";
import SummaryTopContainer from "../SummaryTopContainer";
import BarGraphRevenue from "./BarGraphRevenue";
import BarGraphExpenses from "./BarGraphExpenses";
import CenterGraphRevenue from "./CenterGraphRevenue"; // Import the new component
import "./GraphDisplay.css";
import { parseExcelFile } from "../fetchSpreadsheetData";
import CenterGraphExpenses from "./CenterGraphExpenses";

function GraphDisplay() {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [uniqueOUs, setUniqueOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [totalBudget, setTotalBudget] = useState({ revenue: 0, expenses: 0 });
  const [totalActual, setTotalActual] = useState({ revenue: 0, expenses: 0 });
  const [totalVariance, setTotalVariance] = useState({
    revenue: 0,
    expenses: 0,
  });
  const [totalPercentage, setTotalPercentage] = useState({
    revenue: 0,
    expenses: 0,
  });

  useEffect(() => {
    const storedHeaders = localStorage.getItem("budgetHeaders");
    const storedData = localStorage.getItem("budgetTableData");

    if (storedHeaders && storedData) {
      setHeaders(JSON.parse(storedHeaders));
      setTableData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (headers.length > 0 && tableData.length > 0) {
      localStorage.setItem("budgetHeaders", JSON.stringify(headers));
      localStorage.setItem("budgetTableData", JSON.stringify(tableData));
      extractUniqueOUs(tableData);
    }
  }, [headers, tableData]);

  const extractUniqueOUs = (data) => {
    const ouIndex = headers.indexOf("OU");
    if (ouIndex !== -1 && data.length > 0) {
      setUniqueOUs([...new Set(data.map((row) => row[ouIndex]))]);
    }
  };

  const handleOUClick = (ou) => {
    setSelectedOU(ou);
    const ouIndex = headers.indexOf("OU");
    if (ouIndex !== -1) {
      const filtered = tableData.filter((row) => row[ouIndex] === ou);
      setFilteredData(filtered);
      calculateSummaryValues(filtered);
    }
  };

  const calculateSummaryValues = (filteredData) => {
    if (!filteredData.length) {
      setTotalBudget({ revenue: 0, expenses: 0 });
      setTotalActual({ revenue: 0, expenses: 0 });
      setTotalVariance({ revenue: 0, expenses: 0 });
      setTotalPercentage({ revenue: 0, expenses: 0 });
      return;
    }

    const budgetIndexes = headers
      .map((header, i) => (header.includes("Budget") ? i : -1))
      .filter((i) => i !== -1);

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    let totalBudget = { revenue: 0, expenses: 0 };
    let totalActual = { revenue: 0, expenses: 0 };

    filteredData.forEach((row) => {
      const subAccountIndex = headers.indexOf("Sub-Account");
      const subAccount =
        subAccountIndex !== -1 ? row[subAccountIndex]?.trim() : "";

      const isRevenue = subAccount.toLowerCase() === "null";
      const type = isRevenue ? "revenue" : "expenses";

      budgetIndexes.forEach((i) => {
        const value = parseFloat(row[i]?.toString().replace(/,/g, "") || 0);
        totalBudget[type] += value;
      });

      actualIndexes.forEach((i) => {
        const value = parseFloat(row[i]?.toString().replace(/,/g, "") || 0);
        totalActual[type] += value;
      });
    });

    const totalVariance = {
      revenue: totalActual.revenue - totalBudget.revenue,
      expenses: totalActual.expenses - totalBudget.expenses,
    };

    const totalPercentage = {
      revenue:
        totalBudget.revenue !== 0
          ? ((totalVariance.revenue / totalBudget.revenue) * 100).toFixed(2)
          : "0.00",
      expenses:
        totalBudget.expenses !== 0
          ? ((totalVariance.expenses / totalBudget.expenses) * 100).toFixed(2)
          : "0.00",
    };

    setTotalBudget(totalBudget);
    setTotalActual(totalActual);
    setTotalVariance(totalVariance);
    setTotalPercentage(totalPercentage);
  };

  const handleFileUpload = async (file) => {
    try {
      const data = await parseExcelFile(file);
      setHeaders(data[0]); // First row as headers
      setTableData(data.slice(1)); // Rest of the rows as data
    } catch (error) {
      alert("Error parsing the file");
    }
  };

  return (
    <div className="GraphDisplay">
      <UploadButton setTableData={handleFileUpload} setHeaders={setHeaders} />
      <SummaryTopContainer
        uniqueOUs={uniqueOUs}
        selectedOU={selectedOU}
        handleOUClick={handleOUClick}
        totalBudget={totalBudget}
        totalActual={totalActual}
        totalVariance={totalVariance}
        totalPercentage={totalPercentage}
      />
      <div className="graphs-container">
        <div className="graph-section">
          <BarGraphRevenue tableData={filteredData} headers={headers} />
        </div>
        <br />
        <div className="graph-section">
          <BarGraphExpenses tableData={filteredData} headers={headers} />
        </div>
      </div>
      <br />
      <div className="center-graph-section">
        <CenterGraphRevenue
          tableData={tableData}
          headers={headers}
          selectedOU={selectedOU}
        />
      </div>
      <br />
      <div className="center-graph-section">
        <CenterGraphExpenses
          tableData={tableData}
          headers={headers}
          selectedOU={selectedOU}
        />
      </div>
      <br />
    </div>
  );
}

export default GraphDisplay;
