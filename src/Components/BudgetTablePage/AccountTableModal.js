import React, { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import "./AccountTableModal.css"; // Ensure this CSS file exists
import MonthlyTableModal from "./MonthlyTableModal"; // Import the new modal

const AccountTableModal = ({
  open,
  handleClose,
  selectedRow,
  headers = [],
  tableData = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [monthlyModalOpen, setMonthlyModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    if (selectedRow && headers.length > 0 && tableData.length > 0) {
      filterAccounts();
    }
  }, [selectedRow, searchTerm, headers, tableData]);

  const filterAccounts = () => {
    if (!selectedRow || headers.length === 0 || tableData.length === 0) return;

    const centerIndex = headers.indexOf("Center");
    const subAccountIndex = headers.indexOf("Sub-Account");
    const accountIndex = headers.indexOf("Account");

    if (centerIndex === -1 || subAccountIndex === -1 || accountIndex === -1)
      return;

    const varianceIndexes = headers
      .map((header, i) => (header.includes("Variance") ? i : -1))
      .filter((i) => i !== -1);

    const isRevenue = selectedRow.type === "revenue";
    const summary = {};

    tableData.forEach((row) => {
      if (row[centerIndex] !== selectedRow.center) return;

      const subAccount = row[subAccountIndex];
      const name = isRevenue ? row[accountIndex] : row[subAccountIndex];

      if (
        (isRevenue && subAccount !== "Null") ||
        (!isRevenue && subAccount === "Null")
      ) {
        return;
      }

      const totalVariance = varianceIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );

      if (!summary[name]) {
        summary[name] = 0;
      }
      summary[name] += totalVariance;
    });

    const formattedData = Object.entries(summary)
      .map(([name, total]) => ({
        name,
        total: total.toFixed(2),
      }))
      .filter((entry) =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredData(formattedData);
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setMonthlyModalOpen(true);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 600,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            overflowY: "auto",
          }}
        >
          {/* Modal Title */}
          <Typography
            variant="h4"
            sx={{ color: "#2a5ed4", textAlign: "center", mb: 2 }}
          >
            {selectedRow?.center} /{" "}
            {selectedRow?.type === "revenue" ? "Revenue" : "Expenses"}
          </Typography>

          {/* Search Bar */}
          <div className="search-bar">
            <div className="search-icon">
              <svg
                width="20"
                height="20"
                fill="#2a5ed4"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Search Center..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Data List */}
          <div className="account-list">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  className="account-item"
                  onClick={() => handleAccountClick(item)}
                  style={{ cursor: "pointer" }} // Make it clickable
                >
                  <div className="account-name">{item.name}</div>
                  <div className="account-total">
                    {formatNumber(item.total)}
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
                No data found
              </Typography>
            )}
          </div>
        </Box>
      </Modal>

      {/* Monthly Table Modal */}
      <MonthlyTableModal
        open={monthlyModalOpen}
        handleClose={() => setMonthlyModalOpen(false)}
        selectedAccount={selectedAccount}
        selectedRow={selectedRow}
        headers={headers}
        tableData={tableData}
      />
    </>
  );
};

export default AccountTableModal;
