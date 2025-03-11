import React, { useState, useEffect } from "react";
import RevenueMonthlyTable from "./RevenueMonthlyTable";

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
  const [totalCategoryBudget, setTotalCategoryBudget] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [subModalOpen, setSubModalOpen] = useState(false);

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

    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");

    if (centerIndex === -1 || accountIndex === -1) {
      console.error("❌ Missing required headers: Center or Account.");
      return;
    }

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    const budgetIndexes = headers
      .map((header, i) => (header.includes("Budget") ? i : -1))
      .filter((i) => i !== -1);

    let accountMap = {};
    let totalActual = 0;
    let totalBudget = 0;

    tableData.forEach((row) => {
      const accountName = row[accountIndex]?.trim() || "";

      if (
        row[centerIndex]?.trim() === selectedRow.center &&
        accountName.startsWith(categoryName)
      ) {
        let accountActual = actualIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        let accountBudget = budgetIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        if (accountMap[accountName]) {
          accountMap[accountName].actual += accountActual;
          accountMap[accountName].budget += accountBudget;
        } else {
          accountMap[accountName] = {
            actual: accountActual,
            budget: accountBudget,
          };
        }

        totalActual += accountActual;
        totalBudget += accountBudget;
      }
    });

    let filteredList = Object.keys(accountMap).map((name) => ({
      accountName: name,
      actual: accountMap[name].actual,
      budget: accountMap[name].budget,
    }));

    if (searchTerm) {
      filteredList = filteredList.filter((account) =>
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAccounts(filteredList);
    setTotalCategoryActual(totalActual);
    setTotalCategoryBudget(totalBudget);
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
                <div className="total-flex">
                  <span className="total-label">Total Actual</span>
                  <span className="total-value">
                    {account.actual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="divider-line"></div>
                <div className="total-flex">
                  <span className="total-label">Total Budget</span>
                  <span className="total-value">
                    {account.budget.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No results found</p>
          )}
        </div>

        {/* Total for Selected Category */}
        <div className="total-container">
          <div className="btm-total-box">
            <span className="total-label">Total Actual</span>
            <span className="total-value">
              {totalCategoryActual.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="btm-total-box">
            <span className="total-label">Total Budget</span>
            <span className="total-value">
              {totalCategoryBudget.toLocaleString(undefined, {
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
