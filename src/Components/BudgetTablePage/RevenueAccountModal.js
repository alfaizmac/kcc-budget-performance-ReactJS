import React, { useState, useEffect } from "react";
import RevenueMonthlyTable from "./RevenueMonthlyTable"; // Import the new modal

const RevenueAccountModal = ({
  open,
  handleClose,
  selectedRow,
  categoryName,
  tableData,
  headers,
  selectedOU,
}) => {
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [totalCategoryActual, setTotalCategoryActual] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search state
  const [selectedAccount, setSelectedAccount] = useState(null); // 🔹 Track selected account
  const [subModalOpen, setSubModalOpen] = useState(false); // 🔹 Track if sub-modal is open

  useEffect(() => {
    if (open && categoryName && tableData?.length && headers?.length) {
      filterAccounts();
    }
  }, [open, categoryName, tableData, searchTerm]);

  const filterAccounts = () => {
    if (
      !selectedRow?.center ||
      !tableData?.length ||
      !headers?.length ||
      !categoryName
    ) {
      console.warn("⚠️ Missing required values for filtering accounts.");
      return;
    }

    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");

    if (ouIndex === -1 || centerIndex === -1 || accountIndex === -1) {
      console.error("❌ Missing required headers: OU, Center, or Account.");
      return;
    }

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    let filteredList = [];
    let totalActual = 0;

    tableData.forEach((row) => {
      const accountName = row[accountIndex]?.trim() || "";

      if (
        row[centerIndex]?.trim() === selectedRow.center &&
        accountName.startsWith(categoryName)
      ) {
        let accountTotal = actualIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        filteredList.push({ accountName, total: accountTotal });
        totalActual += accountTotal;
      }
    });

    if (searchTerm) {
      filteredList = filteredList.filter((account) =>
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAccounts(filteredList);
    setTotalCategoryActual(totalActual);
  };

  const handleCategoryClick = (accountName) => {
    setSelectedAccount(accountName);
    setSubModalOpen(true);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {selectedRow?.center} / Revenue / {categoryName}
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

        {/* 🔍 Search Bar */}
        <div className="search-bar">
          <svg width="24" height="24" fill="#2a5ed4" viewBox="0 0 24 24">
            <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Account List */}
        <div className="category-container">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account, index) => (
              <div
                className="category-box"
                key={index}
                style={{
                  background: index % 2 === 0 ? "#316df8" : "#013aa6",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => handleCategoryClick(account.accountName)}
              >
                <span className="category-name">{account.accountName}</span>
                <div className="category-total">
                  <div className="total-flex">
                    <span className="total-label">Total Actual</span>
                    <span className="total-value">
                      {account.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No results found</p>
          )}
        </div>

        {/* Total for Selected Category */}
        <div className="total-container">
          <div className="total-box">
            <span className="total-label">Total Actual</span>
            <span className="total-value">
              {totalCategoryActual.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Monthly Table Modal */}
      {subModalOpen && (
        <RevenueMonthlyTable
          open={subModalOpen}
          handleClose={() => setSubModalOpen(false)}
          selectedRow={selectedRow}
          selectedCategory={categoryName}
          selectedAccount={selectedAccount}
          tableData={tableData}
          headers={headers}
        />
      )}
    </div>
  );
};

export default RevenueAccountModal;
