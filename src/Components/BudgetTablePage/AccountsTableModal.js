import React, { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./AccountsTableModal.css";

const AccountsTableModal = ({
  open,
  handleClose,
  selectedCategory,
  selectedRow,
  headers,
  tableData,
  selectedOU,
}) => {
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  useEffect(() => {
    if (
      !selectedCategory ||
      !selectedRow ||
      !tableData ||
      !headers ||
      !selectedOU
    )
      return;

    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");

    // Get all "Actual" column indexes (Jan_Actual, Feb_Actual, ..., Dec_Actual)
    const actualIndexes = headers
      .map((header, i) => (header.includes("_Actual") ? i : -1))
      .filter((i) => i !== -1);

    const filtered = tableData
      .filter(
        (row) =>
          row[ouIndex] === selectedOU &&
          row[centerIndex] === selectedRow.center &&
          row[accountIndex]?.startsWith(selectedCategory)
      )
      .map((row) => ({
        accountName: row[accountIndex],
        totalActual: actualIndexes.reduce(
          (sum, i) => sum + parseFloat(row[i] || 0),
          0
        ),
      }));

    setFilteredAccounts(filtered);
  }, [selectedCategory, selectedRow, tableData, headers, selectedOU]);

  if (!selectedCategory || !selectedRow) return null;

  const formatNumber = (num) => {
    return isNaN(num) || num === null || num === undefined
      ? "0.00"
      : parseFloat(num).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-container">
        {/* Close Button */}
        <CloseIcon className="close-button" onClick={handleClose} />

        {/* Header: Center / Revenue or Expenses / Category */}
        <Typography className="modal-header">
          {selectedRow.center} /{" "}
          {selectedRow.type === "revenue" ? "Revenue" : "Expenses"} /{" "}
          {selectedCategory}
        </Typography>

        {/* Account List Display */}
        <Box className="account-list-wrapper">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((item, index) => (
              <Box
                key={index}
                className="account-item"
                style={{
                  backgroundColor: index % 2 === 0 ? "#316df8" : "#013aa6",
                }}
              >
                <Typography className="account-name">
                  {item.accountName}
                </Typography>
                <div className="divider"></div>
                <div className="account-total-container">
                  <Typography className="total-actual-title">
                    Total Actual
                  </Typography>
                  <Typography className="account-total">
                    {formatNumber(item.totalActual)}
                  </Typography>
                </div>
              </Box>
            ))
          ) : (
            <Typography className="no-data-message">
              No data available for {selectedCategory}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountsTableModal;
