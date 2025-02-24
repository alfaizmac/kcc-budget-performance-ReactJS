import React, { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./ChartTableModal.css";

const ChartTableModal = ({
  open,
  handleClose,
  selectedRow,
  headers,
  tableData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTotals, setCategoryTotals] = useState({});

  // Revenue and Expense Categories
  const revenueCategories = [
    "Wholesale",
    "Retail",
    "Concession",
    "Lease Income",
    "Other Income",
  ];
  const expenseCategories = ["Administrative", "Selling Expenses"];

  useEffect(() => {
    if (!selectedRow || !tableData || !headers) return;

    const categories =
      selectedRow.type === "revenue" ? revenueCategories : expenseCategories;

    // Initialize total calculations
    const totals = categories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    // Find relevant indexes in the table
    const accountIndex = headers.indexOf("Account");
    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    // Loop through data and sum actual values
    tableData.forEach((row) => {
      const accountName = row[accountIndex];

      let category = "Other Income"; // Default for revenue
      if (selectedRow.type === "revenue") {
        if (accountName.startsWith("Wholesale")) category = "Wholesale";
        else if (accountName.startsWith("Retail")) category = "Retail";
        else if (accountName.startsWith("Concession")) category = "Concession";
        else if (accountName.startsWith("Lease Income"))
          category = "Lease Income";
      } else {
        if (accountName.startsWith("Administrative"))
          category = "Administrative";
        else if (accountName.startsWith("Selling"))
          category = "Selling Expenses";
      }

      // Sum actuals for all months
      totals[category] += actualIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );
    });

    setCategoryTotals(totals);
  }, [selectedRow, tableData, headers]);

  if (!selectedRow) return null;

  const formatNumber = (num) => {
    return isNaN(num) || num === null || num === undefined
      ? "0.00"
      : parseFloat(num).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  // Get the list of displayed categories
  const displayedCategories =
    selectedRow.type === "revenue" ? revenueCategories : expenseCategories;

  // Compute the total actual sum
  const totalActualSum = displayedCategories.reduce(
    (sum, category) => sum + categoryTotals[category] || 0,
    0
  );

  // Set modal height dynamically
  const modalHeight = selectedRow.type === "revenue" ? "830px" : "670px";

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-container" style={{ height: modalHeight }}>
        <CloseIcon className="close-button" onClick={handleClose} />

        <Typography className="modal-header">
          {selectedRow.center} /{" "}
          {selectedRow.type === "revenue" ? "Revenue" : "Expenses"}
        </Typography>

        {/* Search Bar */}
        <div className="search-bar">
          <svg
            width="24"
            height="24"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
          >
            <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>

        {/* Account List Container */}
        <Box className="account-list-wrapper">
          {displayedCategories.map((category, index) => (
            <Box
              key={index}
              className="account-item"
              style={{
                backgroundColor: index % 2 === 0 ? "#316df8" : "#013aa6",
              }}
            >
              <Typography className="account-name">{category}</Typography>

              <div className="account-total-container">
                <Typography className="total-actual-title">
                  Total Actual
                </Typography>
                <Typography className="account-total">
                  {formatNumber(categoryTotals[category] || 0)}
                </Typography>
              </div>
            </Box>
          ))}
        </Box>

        {/* Total Actual Container */}
        <Box className="total-actual-wrapper">
          <Box className="total-actual-container">
            <Typography className="total-actual-label">Total Actual</Typography>
            <Typography className="total-actual-value">
              {formatNumber(totalActualSum)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChartTableModal;
