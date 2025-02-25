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

  useEffect(() => {
    if (!selectedRow || !tableData || !headers) return;

    const totals = {
      Wholesale: 0,
      Retail: 0,
      Concession: 0,
      "Lease Income": 0,
      "Other Income": 0,
      Administrative: 0,
      "Selling Expenses": 0,
    };

    const accountIndex = headers.indexOf("Account");
    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    tableData.forEach((row) => {
      const accountName = row[accountIndex];

      if (selectedRow.type === "revenue") {
        if (accountName.startsWith("Wholesale"))
          totals.Wholesale += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
        else if (accountName.startsWith("Retail"))
          totals.Retail += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
        else if (accountName.startsWith("Concession"))
          totals.Concession += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
        else if (accountName.startsWith("Lease Income"))
          totals["Lease Income"] += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
        else
          totals["Other Income"] += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
      } else {
        if (accountName.startsWith("Administrative"))
          totals.Administrative += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
        else if (accountName.startsWith("Selling"))
          totals["Selling Expenses"] += actualIndexes.reduce(
            (sum, i) => sum + parseFloat(row[i] || 0),
            0
          );
      }
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

  const revenueCategories = [
    "Wholesale",
    "Retail",
    "Concession",
    "Lease Income",
    "Other Income",
  ];
  const expenseCategories = ["Administrative", "Selling Expenses"];
  const displayedCategories =
    selectedRow.type === "revenue" ? revenueCategories : expenseCategories;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-container">
        <CloseIcon className="close-button" onClick={handleClose} />

        <Typography className="modal-header">
          {selectedRow.center} /{" "}
          {selectedRow.type === "revenue" ? "Revenue" : "Expenses"}
        </Typography>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>

        <Box className="account-list-wrapper">
          {displayedCategories.map((category, index) => (
            <Box
              key={index}
              className={`account-item ${
                index % 2 === 0 ? "bg-blue" : "bg-dark-blue"
              }`}
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

        <Box className="total-actual-wrapper">
          <Box className="total-actual-container">
            <Typography className="total-actual-label">Total Actual</Typography>
            <Typography className="total-actual-value">
              {formatNumber(
                Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChartTableModal;
