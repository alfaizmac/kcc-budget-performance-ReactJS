import React, { useState, useEffect } from "react";
import OUTableShowButton from "./OUTableShowButton";
import CenterSummary from "./OUTable";
import UploadButton from "../UploadButton";
import "./BudgetTableDisplay.css";

import { parseExcelFile } from "../fetchSpreadsheetData";

function BudgetTableDisplay() {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [uniqueOUs, setUniqueOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState(null);
  const [centerSummary, setCenterSummary] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

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
      calculateCenterSummary(filtered);
    }
  };

  const calculateCenterSummary = (filteredData) => {
    const centerIndex = headers.indexOf("Center");
    const subAccountIndex = headers.indexOf("Sub-Account");
    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    const summary = {};

    filteredData.forEach((row) => {
      const center = row[centerIndex];
      const subAccount = row[subAccountIndex];
      const isRevenue = subAccount === "Null";

      if (!summary[center]) {
        summary[center] = { revenue: 0, expenses: 0 };
      }

      const totalActual = actualIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );

      if (isRevenue) {
        summary[center].revenue += totalActual;
      } else {
        summary[center].expenses += totalActual;
      }
    });

    setCenterSummary(
      Object.entries(summary).map(([center, values]) => ({
        center,
        revenue: values.revenue.toFixed(2), // Ensure two decimal places
        expenses: values.expenses.toFixed(2), // Ensure two decimal places
      }))
    );
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  return (
    <div className="BudgetTable">
      <UploadButton setTableData={handleFileUpload} setHeaders={setHeaders} />
      <div className="select-ou">
        <p>Select OU:</p>
        <OUTableShowButton
          uniqueOUs={uniqueOUs}
          selectedOU={selectedOU}
          handleOUClick={handleOUClick}
        />
      </div>
      <br />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Center..."
          value={searchTerm}
          onChange={handleSearchChange} // Bind input change to state
        />
      </div>

      <div className="data-container">
        <CenterSummary
          selectedOU={selectedOU}
          centerSummary={centerSummary}
          searchTerm={searchTerm} // Pass search term to OUTable.js
        />
      </div>
    </div>
  );
}

export default BudgetTableDisplay;
