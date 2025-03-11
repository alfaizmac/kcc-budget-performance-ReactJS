import React, { useState, useEffect } from "react";
import CenterSummary from "./OUTable";
import UploadButton from "../UploadButton";
import "./BudgetTableDisplay.css";
import SummaryTopContainer from "../SummaryTopContainer";

import { parseExcelFile } from "../fetchSpreadsheetData";

function BudgetTableDisplay() {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [uniqueOUs, setUniqueOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState(null);
  const [centerSummary, setCenterSummary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleFileUpload = async (file) => {
    try {
      const data = await parseExcelFile(file);
      setHeaders(data[0]); // First row as headers
      setTableData(data.slice(1)); // Rest of the rows as data
    } catch (error) {
      alert("Error parsing the file");
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

  return (
    <div className="BudgetTable">
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
      <div className="search-print-container">
        {/* Search Bar */}
        <div className="search-bar">
          <svg width="24" height="24" fill="#2a5ed4" viewBox="0 0 24 24">
            <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
        {/* Print Button */}
        <button className="print-button">Print</button>
      </div>
      <br />
      {/* Data Table */}
      <div className="data-container">
        <CenterSummary
          selectedOU={selectedOU}
          centerSummary={centerSummary}
          searchTerm={searchTerm}
          headers={headers}
          tableData={tableData}
        />
      </div>
      {/* New container */}
      <div className="summary-total-container">
        {/* Left Container: Revenue */}
        <div className="revenue-container">
          <h2>Revenue (Total)</h2>
          <div className="data-row">
            <span>Actual:</span>
            <span>000,000,000</span>
          </div>
          <div className="data-row">
            <span>Budget:</span>
            <span>000,000,000</span>
          </div>
          <div className="data-row">
            <span>Variance:</span>
            <span>000,000,000</span>
          </div>
          <div className="data-row">
            <span>%:</span>
            <span>100%</span>
          </div>
        </div>

        {/* Right Container: Expenses */}
        <div className="expenses-container">
          <h2>Expenses (Total)</h2>
          <div className="data-row">
            <span>Actual:</span>
            <span>000,000,000</span>
          </div>
          <div className="data-row">
            <span>Budget:</span>
            <span>000,000,000</span>
          </div>
          <div className="data-row">
            <span>Variance:</span>
            <span>000,000,000</span>
          </div>
          <div className="data-row">
            <span>%:</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}

export default BudgetTableDisplay;
