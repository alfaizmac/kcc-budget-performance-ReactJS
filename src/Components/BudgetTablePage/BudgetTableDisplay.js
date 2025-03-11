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

  const handlePrint = () => {
    const printContent = document.getElementById("printableContent");
    const printWindow = window.open("", "", "width=800,height=600");

    // Adding a basic header and print styles
    printWindow.document.write("<html><head><title>Print Report</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(`
      body { font-family: Intern, Arial, sans-serif; }
      .center-summary-container {
        padding: 20px;
        width: calc(100% - 40px);
        scrollbar-width: none; /* Hide scrollbar for Firefox */
        -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
        overflow-y: auto;
      }
      .center-summary-list {
        max-height: 600px;
      }
      .center-summary-container::-webkit-scrollbar {
        width: 0;
        display: none;
      }
  
      .center-summary {
        display: flex;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 15px;
        justify-content: space-between;
        align-items: center;
        height: 120px;
        color: white; /* Ensure all text is white */
      }
  
      .center-summary:nth-child(even) {
        background: #013aa6; /* Dark Blue */
      }
  
      .center-summary:nth-child(odd) {
        background: #316efa; /* Light Blue */
      }
  
      .center-details {
        flex: 1;
        padding: 20px;
        text-align: left;
      }
  
      .center-details .center-title {
        font-size: 12px;
        font-weight: 300;
        margin-bottom: 5px;
      }
  
      .center-details .center-name {
        font-size: 24px;
        font-weight: bold;
      }
  
      .summary-box {
        width: 25%;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
      }
  
      .summary-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
      }
  
      .summary-item {
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
      }
  
      .divider-line {
        width: 2px;
        background-color: white;
        height: 80%;
        opacity: 0.5;
      }

      .summary-total-container {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border-radius: 12px;
  gap: 15px;
}

.revenue-container {
  width: 48%; /* Each container takes up 50% of the space */
  padding: 15px;
  background-color: #51c1cd;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.expenses-container {
  width: 48%; /* Each container takes up 50% of the space */
  padding: 15px;
  background-color: #fca44a;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.revenue-container h2,
.expenses-container h2 {
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
}

.data-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #fff;
  font-size: 18px;
}

.data-row span:first-child {
  font-weight: bold;
  font-size: 18px;
}

  /* Prevent page break in the middle of a center-summary item */
  .center-summary {
    page-break-inside: avoid;
  }

  /* Make sure the table and its contents don't get cut off */
  .center-summary-container {
    page-break-before: auto;
    page-break-after: always;
  }        
      .center-summary-list {
    max-height: calc(100vh - 100px); /* Adjust to avoid cutting content */
    overflow: visible;
  }

  .revenue-container{
      page-break-inside: avoid;
  }
    `);
    printWindow.document.write("</style></head><body>");

    // Adding the title at the top
    printWindow.document.write(`
      <div class="print-title" style="text-align: center;">
        <div class="budget-title" style="color: #316efa;"><h1>Budget Performance Report</h1></div>
        <div class="center-title"><h2>${selectedOU} Centers</h2></div>
      </div>
    `);
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
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
        <div className="print">
          {/* Print Button */}
          <button onClick={handlePrint} className="print-button-center">
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M18.5 16h-13v6h13v-6Z"></path>
              <path
                d="M2 10h20v9h-3.491v-3H5.49v3H2v-9Z"
                clipRule="evenodd"
              ></path>
              <path d="M19 2H5v8h14V2Z"></path>
            </svg>
            Print
          </button>
        </div>
      </div>
      {/* Data Table */}
      <div className="data-container">
        <CenterSummary
          selectedOU={selectedOU}
          centerSummary={centerSummary}
          searchTerm={searchTerm}
          headers={headers}
          tableData={tableData}
          uniqueOUs={uniqueOUs}
          handleOUClick={handleOUClick}
          totalBudget={totalBudget}
          totalActual={totalActual}
          totalVariance={totalVariance}
          totalPercentage={totalPercentage}
        />
      </div>
    </div>
  );
}

export default BudgetTableDisplay;
