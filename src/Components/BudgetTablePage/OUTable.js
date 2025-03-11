import React, { useState, useEffect } from "react";
import RevenueCategoryModal from "./RevenueCategoryModal";
import ExpensesCategoryModal from "./ExpensesCategoryModal";
import "./OUTable.css";

const CenterSummary = ({
  selectedOU,
  centerSummary,
  searchTerm,
  headers,
  tableData,
}) => {
  const [openRevenueModal, setOpenRevenueModal] = useState(false);
  const [openExpensesModal, setOpenExpensesModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (selectedOU) {
      calculateSummary();
    }
  }, [selectedOU, tableData]);

  const handleCloseModals = () => {
    setOpenRevenueModal(false);
    setOpenExpensesModal(false);
  };

  const handleBoxClick = (center, type) => {
    setSelectedRow({ selectedOU, center, type });
    if (type === "revenue") {
      setOpenRevenueModal(true);
    } else {
      setOpenExpensesModal(true);
    }
  };

  const formatNumber = (num) => {
    if (isNaN(num) || num === null || num === undefined) return "0.00";
    return parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateSummary = () => {
    const centerData = {};
    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const subAccountIndex = headers.indexOf("Sub-Account");

    const budgetIndexes = headers
      .map((header, i) => (header.includes("Budget") ? i : -1))
      .filter((i) => i !== -1);
    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);
    const varianceIndexes = headers
      .map((header, i) => (header.includes("Variance") ? i : -1))
      .filter((i) => i !== -1);

    tableData.forEach((row) => {
      if (row[ouIndex] !== selectedOU) return;

      const center = row[centerIndex];
      const subAccount = row[subAccountIndex];
      const isRevenue = subAccount === "Null";

      if (!centerData[center]) {
        centerData[center] = {
          revenueActual: 0,
          revenueBudget: 0,
          revenueVariance: 0,
          expenseActual: 0,
          expenseBudget: 0,
          expenseVariance: 0,
        };
      }

      const totalActual = actualIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );
      const totalBudget = budgetIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );
      const totalVariance = varianceIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );

      if (isRevenue) {
        centerData[center].revenueActual += totalActual;
        centerData[center].revenueBudget += totalBudget;
        centerData[center].revenueVariance += totalVariance; // ✅ SUM variance
      } else {
        centerData[center].expenseActual += totalActual;
        centerData[center].expenseBudget += totalBudget;
        centerData[center].expenseVariance += totalVariance; // ✅ SUM variance
      }
    });

    setProcessedData(
      Object.entries(centerData).map(([center, values]) => ({
        center,
        revenueActual: values.revenueActual,
        revenueBudget: values.revenueBudget,
        revenueVariance: values.revenueVariance,
        revenuePercentage:
          values.revenueBudget !== 0
            ? (values.revenueVariance / values.revenueBudget) * 100
            : 0,
        expenseActual: values.expenseActual,
        expenseBudget: values.expenseBudget,
        expenseVariance: values.expenseVariance,
        expensePercentage:
          values.expenseBudget !== 0
            ? (values.expenseVariance / values.expenseBudget) * 100
            : 0,
      }))
    );
  };

  const filteredCenters = processedData.filter((row) =>
    row.center.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="center-summary-container">
      <div className="center-summary-list">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((row, index) => (
            <div
              key={index}
              className="center-summary"
              style={{
                backgroundColor: index % 2 === 0 ? "#316EFA" : "#013AA6",
                color: "#ffffff",
              }}
            >
              <div className="center-details">
                <div className="center-title">Center Name</div>
                <div className="center-name">{row.center}</div>
              </div>
              <div className="divider-line"></div>
              <div
                className="summary-box"
                onClick={() => handleBoxClick(row.center, "revenue")}
              >
                <div className="summary-title">Revenue</div>
                <div className="summary-item">
                  <span>Actual</span>
                  <span>{formatNumber(row.revenueActual)}</span>
                </div>
                <div className="summary-item">
                  <span>Budget</span>
                  <span>{formatNumber(row.revenueBudget)}</span>
                </div>
                <div className="summary-item">
                  <span>Variance</span>
                  <span>{formatNumber(row.revenueVariance)}</span>
                </div>
                <div className="summary-item">
                  <span>%</span>
                  <span>{formatNumber(row.revenuePercentage)}%</span>
                </div>
              </div>
              <div className="divider-line"></div>
              <div
                className="summary-box"
                onClick={() => handleBoxClick(row.center, "expenses")}
              >
                <div className="summary-title">Expenses</div>
                <div className="summary-item">
                  <span>Actual</span>
                  <span>{formatNumber(row.expenseActual)}</span>
                </div>
                <div className="summary-item">
                  <span>Budget</span>
                  <span>{formatNumber(row.expenseBudget)}</span>
                </div>
                <div className="summary-item">
                  <span>Variance</span>
                  <span>{formatNumber(row.expenseVariance)}</span>
                </div>
                <div className="summary-item">
                  <span>%</span>
                  <span>{formatNumber(row.expensePercentage)}%</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No centers found</p>
        )}
      </div>

      <RevenueCategoryModal
        open={openRevenueModal}
        handleClose={handleCloseModals}
        selectedRow={selectedRow}
        tableData={tableData}
        headers={headers}
        selectedOU={selectedOU}
      />

      <ExpensesCategoryModal
        open={openExpensesModal}
        handleClose={handleCloseModals}
        selectedRow={selectedRow}
        tableData={tableData}
        headers={headers}
        selectedOU={selectedOU}
      />
    </div>
  );
};

export default CenterSummary;
