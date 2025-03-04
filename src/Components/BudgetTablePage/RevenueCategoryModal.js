import React, { useState, useEffect } from "react";
import "./CategoryModal.css";
import RevenueAccountModal from "./RevenueAccountModal";

const RevenueCategoryModal = ({
  open,
  handleClose,
  selectedRow,
  tableData,
  headers,
  selectedOU,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wholesaleTotal, setWholesaleTotal] = useState(0);
  const [retailTotal, setRetailTotal] = useState(0);
  const [concessionTotal, setConcessionTotal] = useState(0);
  const [leaseIncomeTotal, setLeaseIncomeTotal] = useState(0);
  const [otherIncomeTotal, setOtherIncomeTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category

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

    let wholesaleSum = 0,
      retailSum = 0,
      concessionSum = 0,
      leaseIncomeSum = 0,
      otherIncomeSum = 0;

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

        if (accountName.startsWith("Wholesale")) wholesaleSum += totalActual;
        else if (accountName.startsWith("Retail")) retailSum += totalActual;
        else if (accountName.startsWith("Concession"))
          concessionSum += totalActual;
        else if (accountName.startsWith("Lease")) leaseIncomeSum += totalActual;
        else if (accountName.startsWith("Other")) otherIncomeSum += totalActual;
      }
    });

    setWholesaleTotal(wholesaleSum);
    setRetailTotal(retailSum);
    setConcessionTotal(concessionSum);
    setLeaseIncomeTotal(leaseIncomeSum);
    setOtherIncomeTotal(otherIncomeSum);
    setTotalRevenue(
      wholesaleSum + retailSum + concessionSum + leaseIncomeSum + otherIncomeSum
    );
  };

  if (!open || !selectedRow?.center) return null;

  // Filtered Categories Based on Search
  const filteredCategories = [
    { name: "Wholesale", total: wholesaleTotal },
    { name: "Retail", total: retailTotal },
    { name: "Concession", total: concessionTotal },
    { name: "Lease Income", total: leaseIncomeTotal },
    { name: "Other Income", total: otherIncomeTotal },
  ].filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{selectedRow?.center} / Revenue</h2>
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

        {/* Search Bar */}
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

        {/* Revenue Categories (Clickable) */}
        <div className="category-container">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                className="category-box"
                key={index}
                style={{
                  background: index % 2 === 0 ? "#316df8" : "#013aa6",
                  color: "#ffffff",
                }}
                onClick={() => setSelectedCategory(category.name)} // Open SubAccountModal on click
              >
                <span className="category-name">{category.name}</span>
                <div className="total-flex">
                  <span className="total-label">Total Actual</span>
                  <span className="total-value">
                    {category.total.toLocaleString(undefined, {
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

        {/* Total Revenue */}
        <div className="total-container">
          <div className="btm-total-box">
            <span className="total-label">Total Actual</span>
            <span className="total-value">
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* RevenueAccountModal - Opens when a category is selected */}
      {selectedCategory && (
        <RevenueAccountModal
          open={!!selectedCategory}
          handleClose={() => setSelectedCategory(null)}
          selectedRow={selectedRow}
          categoryName={selectedCategory}
          tableData={tableData}
          headers={headers}
          selectedOU={selectedOU}
        />
      )}
    </div>
  );
};

export default RevenueCategoryModal;
