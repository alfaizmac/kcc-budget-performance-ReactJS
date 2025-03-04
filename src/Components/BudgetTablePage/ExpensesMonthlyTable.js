import React, { useEffect, useState, useRef } from "react";
import "./ExpensesMonthlyTable.css";

const ExpensesMonthlyTable = ({
  open,
  handleClose,
  selectedRow,
  selectedCategory,
  selectedSubAccount,
  tableData,
  headers,
}) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    if (
      open &&
      selectedRow &&
      selectedCategory &&
      selectedSubAccount &&
      tableData.length &&
      headers.length
    ) {
      extractMonthlyData();
    }
  }, [open, selectedRow, selectedCategory, selectedSubAccount, tableData]);

  const extractMonthlyData = () => {
    if (!selectedRow || !selectedCategory || !selectedSubAccount) return;

    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");
    const subAccountIndex = headers.indexOf("Sub-Account");

    if (centerIndex === -1 || accountIndex === -1 || subAccountIndex === -1) {
      console.error(
        "❌ Missing required headers: Center, Account, Sub-Account."
      );
      return;
    }

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

    let extractedData = months.map((month) => ({
      month,
      budget: 0,
      actual: 0,
      variance: 0,
      percentage: 0,
    }));

    tableData.forEach((row) => {
      const accountName = row[accountIndex]?.trim() || "";
      const subAccountName = row[subAccountIndex]?.trim() || "";

      if (
        row[centerIndex]?.trim() === selectedRow.center &&
        accountName === selectedCategory &&
        subAccountName === selectedSubAccount
      ) {
        months.forEach((month, index) => {
          const budgetIndex = headers.indexOf(`${month}_Budget`);
          const actualIndex = headers.indexOf(`${month}_Actual`);
          const varianceIndex = headers.indexOf(`${month}_Variance`);
          const percentIndex = headers.indexOf(`${month}_Percent`);

          if (budgetIndex !== -1 && actualIndex !== -1) {
            extractedData[index].budget += parseFloat(row[budgetIndex]) || 0;
            extractedData[index].actual += parseFloat(row[actualIndex]) || 0;
            extractedData[index].variance +=
              parseFloat(row[varianceIndex]) || 0;
            extractedData[index].percentage +=
              parseFloat(row[percentIndex]) || 0;
          }
        });
      }
    });

    setMonthlyData(extractedData);
  };

  if (!open || !selectedRow || !selectedCategory || !selectedSubAccount)
    return null;

  // **Calculate Totals**
  const totalBudget = monthlyData.reduce((sum, data) => sum + data.budget, 0);
  const totalActual = monthlyData.reduce((sum, data) => sum + data.actual, 0);
  const totalVariance = monthlyData.reduce(
    (sum, data) => sum + data.variance,
    0
  );
  const totalPercentage =
    totalBudget !== 0 ? (totalVariance / totalBudget) * 100 : 0;

  // **Print Table Function**
  const handlePrint = () => {
    const printContent = `
      <html>
      <head>
        <title>Print Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
          }
          h1 {
            color: #316df8;
            margin-bottom: 5px;
          }
          h2 {
            font-size: 20px;
            color: #000;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          thead {
            background: #316df8;
            color: white;
            font-weight: bold;
          }
          th, td {
            padding: 10px;
            border: 1px solid #dcdcdc;
            text-align: center;
          }
          tbody tr:nth-child(even) {
            background: #f7f8fc;
          }
          .total-row {
            font-weight: bold;
            background: #e3eafc;
          }
        </style>
      </head>
      <body>
        <h1>Budget Performance Report</h1>
        <h2>${selectedRow.center} / Expenses / ${selectedCategory} / ${selectedSubAccount}</h2>
        ${printRef.current.innerHTML}
      </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=900,height=600");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-monthly">
        {/* Header */}
        <div className="modal-header">
          <h2>
            {selectedRow.center} / Expenses / {selectedCategory} /{" "}
            {selectedSubAccount}
          </h2>
          <button className="close-button" onClick={handleClose}>
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="#c8c8c8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="close-icon"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        {/* Monthly Data Table */}
        <div className="table-container" ref={printRef}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Budget</th>
                <th>Actual</th>
                <th>Variance</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>
                    {data.budget.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {data.actual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {data.variance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {data.percentage.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                    %
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="total-row">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>
                    {totalBudget.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </td>
                <td>
                  <strong>
                    {totalActual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </td>
                <td>
                  <strong>
                    {totalVariance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </td>
                <td>
                  <strong>
                    {totalPercentage.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                    %
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Print Button */}
        <button className="print-button" onClick={handlePrint}>
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
  );
};

export default ExpensesMonthlyTable;
