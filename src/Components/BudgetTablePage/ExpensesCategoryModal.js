import React, { useState, useEffect } from "react";
import ExpensesSubAccountModal from "./ExpensesSubAccountModal";

const ExpensesCategoryModal = ({
  open,
  handleClose,
  selectedRow,
  tableData,
  headers,
  selectedOU,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subModalOpen, setSubModalOpen] = useState(false);

  useEffect(() => {
    if (open && selectedRow?.center && tableData?.length && headers?.length) {
      calculateTotals();
    }
  }, [open, selectedRow, tableData]);

  const calculateTotals = () => {
    if (
      !selectedOU ||
      !selectedRow?.center ||
      !tableData?.length ||
      !headers?.length
    ) {
      return;
    }

    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");

    if (ouIndex === -1 || centerIndex === -1 || accountIndex === -1) {
      return;
    }

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    const budgetIndexes = headers
      .map((header, i) => (header.includes("Budget") ? i : -1))
      .filter((i) => i !== -1);

    let categories = ["Administrative Expenses", "Selling Expenses"];

    let totals = categories.map((category) => ({
      name: category,
      actual: 0,
      budget: 0,
    }));

    tableData.forEach((row) => {
      const accountName = row[accountIndex]?.trim() || "";
      if (
        row[ouIndex]?.trim() === selectedOU &&
        row[centerIndex]?.trim() === selectedRow.center
      ) {
        let totalActual = actualIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        let totalBudget = budgetIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        totals.forEach((category) => {
          if (accountName.startsWith(category.name)) {
            category.actual += totalActual;
            category.budget += totalBudget;
          }
        });
      }
    });

    setCategoryTotals(totals);
    setTotalExpenses(totals.reduce((sum, cat) => sum + cat.actual, 0));
    setTotalBudget(totals.reduce((sum, cat) => sum + cat.budget, 0));
  };

  if (!open || !selectedRow?.center) return null;

  const filteredCategories = categoryTotals.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSubModalOpen(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{selectedRow.center} / Expenses</h2>
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

        <div className="search-bar">
          <svg width="24" height="24" fill="#2a5ed4" viewBox="0 0 24 24">
            <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-container">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                className="category-box"
                key={index}
                onClick={() => handleCategoryClick(category)}
                style={{
                  background: index % 2 === 0 ? "#316df8" : "#013aa6",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <span className="category-name">{category.name}</span>
                <div className="total-flex">
                  <span className="total-label">Total Actual</span>
                  <span className="total-value">
                    {category.actual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="divider-line"></div>
                <div className="total-flex">
                  <span className="total-label">Total Budget</span>
                  <span className="total-value">
                    {category.budget.toLocaleString(undefined, {
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

        <div className="total-container">
          <div className="btm-total-box">
            <span className="total-label">Total Actual</span>
            <span className="total-value">
              {totalExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="btm-total-box">
            <span className="total-label">Total Budget</span>
            <span className="total-value">
              {totalBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Account Modal */}
      {subModalOpen && (
        <ExpensesSubAccountModal
          open={subModalOpen}
          handleClose={() => setSubModalOpen(false)}
          selectedRow={selectedRow}
          category={selectedCategory}
          tableData={tableData}
          headers={headers}
          selectedOU={selectedOU}
        />
      )}
    </div>
  );
};

export default ExpensesCategoryModal;
