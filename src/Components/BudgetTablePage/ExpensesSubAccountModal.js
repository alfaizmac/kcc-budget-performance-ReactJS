import React, { useState, useEffect } from "react";
import ExpensesMonthlyTable from "./ExpensesMonthlyTable"; // Import the new modal

const ExpensesSubAccountModal = ({
  open,
  handleClose,
  selectedRow,
  category,
  tableData,
  headers,
  selectedOU,
}) => {
  const [subAccounts, setSubAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalActual, setTotalActual] = useState(0);
  const [selectedSubAccount, setSelectedSubAccount] = useState(null);
  const [subAccountModalOpen, setSubAccountModalOpen] = useState(false);

  useEffect(() => {
    if (open && category && selectedRow && tableData.length && headers.length) {
      extractSubAccounts();
    }
  }, [open, category, selectedRow, tableData]);

  const extractSubAccounts = () => {
    if (!selectedOU || !selectedRow?.center || !category) return;

    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");
    const subAccountIndex = headers.indexOf("Sub-Account");

    if (
      ouIndex === -1 ||
      centerIndex === -1 ||
      accountIndex === -1 ||
      subAccountIndex === -1
    ) {
      console.error(
        "❌ Missing required headers: OU, Center, Account, Sub-Account."
      );
      return;
    }

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    let filteredSubAccounts = [];
    let totalSum = 0;

    tableData.forEach((row) => {
      const accountName = row[accountIndex]?.trim() || "";
      const subAccountName = row[subAccountIndex]?.trim() || "";

      if (
        row[ouIndex]?.trim() === selectedOU &&
        row[centerIndex]?.trim() === selectedRow.center &&
        accountName.startsWith(category.name)
      ) {
        let totalActual = actualIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        totalSum += totalActual;

        filteredSubAccounts.push({
          name: subAccountName,
          total: totalActual,
        });
      }
    });

    setSubAccounts(filteredSubAccounts);
    setTotalActual(totalSum);
  };

  if (!open || !category || !selectedRow) return null;

  // **Filter Sub-Accounts Based on Search**
  const filteredSubAccounts = subAccounts.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>
            {selectedRow.center} / Expenses / {category.name}
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

        {/* Search Bar */}
        <div className="search-bar">
          <svg width="24" height="24" fill="#2a5ed4" viewBox="0 0 24 24">
            <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Sub-Account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sub-Accounts List */}
        <div className="category-container">
          {filteredSubAccounts.length > 0 ? (
            filteredSubAccounts.map((sub, index) => (
              <div
                className="category-box"
                key={index}
                style={{
                  background: index % 2 === 0 ? "#316df8" : "#013aa6",
                  color: "#ffffff",
                }}
                onClick={() => {
                  setSelectedSubAccount(sub.name);
                  setSubAccountModalOpen(true);
                }}
              >
                <span className="category-name">{sub.name}</span>
                <div className="category-total">
                  <div className="total-flex">
                    <span className="total-label">Total Actual</span>
                    <span className="total-value">
                      {sub.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No Sub-Accounts found</p>
          )}
        </div>

        {/* Total Actual at the Bottom */}
        <div className="total-container">
          <div className="total-box">
            <span className="total-label">Total Actual</span>
            <span className="total-value">
              {totalActual.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Sub-Account Monthly Table Modal */}
        {subAccountModalOpen && (
          <ExpensesMonthlyTable
            open={subAccountModalOpen}
            handleClose={() => setSubAccountModalOpen(false)}
            selectedRow={selectedRow}
            selectedCategory={category.name}
            selectedSubAccount={selectedSubAccount}
            tableData={tableData}
            headers={headers}
          />
        )}
      </div>
    </div>
  );
};

export default ExpensesSubAccountModal;
