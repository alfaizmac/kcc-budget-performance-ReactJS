import React, { useEffect, useState, useRef } from "react";

const RevenueMonthlyTable = ({
  open,
  handleClose,
  selectedRow,
  selectedCategory,
  selectedAccount,
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
      selectedAccount &&
      tableData.length &&
      headers.length
    ) {
      extractMonthlyData();
    }
  }, [open, selectedRow, selectedCategory, selectedAccount, tableData]);

  const extractMonthlyData = () => {
    if (!selectedRow || !selectedCategory || !selectedAccount) return;

    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");

    if (centerIndex === -1 || accountIndex === -1) {
      console.error("❌ Missing required headers: Center or Account.");
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

      if (
        row[centerIndex]?.trim() === selectedRow.center &&
        accountName === selectedAccount
      ) {
        months.forEach((month, index) => {
          const budgetIndex = headers.indexOf(`${month}_Budget`);
          const actualIndex = headers.indexOf(`${month}_Actual`);
          const varianceIndex = headers.indexOf(`${month}_Variance`);
          const percentIndex = headers.indexOf(`${month}_Percent`);

          if (
            budgetIndex !== -1 &&
            actualIndex !== -1 &&
            varianceIndex !== -1 &&
            percentIndex !== -1
          ) {
            extractedData[index].budget += parseFloat(row[budgetIndex]) || 0;
            extractedData[index].actual += parseFloat(row[actualIndex]) || 0;
            extractedData[index].variance +=
              parseFloat(row[varianceIndex]) || 0;
            extractedData[index].percentage =
              extractedData[index].budget !== 0
                ? (extractedData[index].variance /
                    extractedData[index].budget) *
                  100
                : 0;
          }
        });
      }
    });

    setMonthlyData(extractedData);
  };

  if (!open || !selectedRow || !selectedCategory || !selectedAccount)
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
            font-family: Intern, Arial, sans-serif;
            text-align: center;
            margin: 20px;
          }
          h1 {
            color: #316df8;
            margin-bottom: 5px;
          }
          /* Modal Container */
.modal-container-monthly {
  position: relative;
  background: #f4f5f9;
  width: 800px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  height: 740px;
}

/* Table Container */
.table-container {
  max-height: 100%;
  overflow-y: auto;
  border-radius: 8px;
  background: white;
  padding: 10px;
  border: 1px solid #c8c8c8;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

/* Table Header */
.data-table thead tr {
  background: #316df8;
  color: white;
  font-weight: bold;
}

.data-table thead th {
  padding: 12px;
  text-align: center;
  border: 1px solid #dcdcdc;
}

/* Table Body */
.data-table tbody tr {
  background: white;
  transition: background 0.2s;
}

.data-table tbody tr:nth-child(even) {
  background: #f7f8fc;
}

.data-table tbody td {
  padding: 10px;
  text-align: center;
  border: 1px solid #dcdcdc;
  color: #333;
}

/* Row Hover Effect */
.data-table tbody tr:hover {
  background: #e3eafc;
  transition: 0.3s ease-in-out;
}

/* Total Row Styling */
.total-row {
  background: #316df8;
  color: white;
  font-weight: bold;
}

.total-row td {
  padding: 12px;
  text-align: center;
  border: 1px solid #dcdcdc;
}

/* Print Button */
.print-button {
  background: #316df8;
  color: white;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  position: absolute;
  bottom: 10px;
  right: 20px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.print-button:hover {
  background: #2555b7;
}

        </style>
      </head>
      <body>
        <h1>Budget Performance Report</h1>
        <h2>${selectedRow.center} / Revenue / ${selectedCategory} / ${selectedAccount}</h2>
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
            {selectedRow.center} / Revenue / {selectedCategory} /{" "}
            {selectedAccount}
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
                <th>Actual</th>
                <th>Budget</th>
                <th>Variance</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>
                    {data.actual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {data.budget.toLocaleString(undefined, {
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
                    {totalActual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
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
        <div className="print-button-container">
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
    </div>
  );
};

export default RevenueMonthlyTable;
