import React, { useState, useEffect } from "react";
import "./RevenueCategoryModal.css";

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

  useEffect(() => {
    console.log("Modal Open:", open);
    console.log("Selected OU:", selectedOU);
    console.log("Selected Center:", selectedRow?.center);
    console.log("Table Data Loaded:", tableData?.length);

    if (open && selectedRow?.center && tableData?.length && headers?.length) {
      calculateTotals();
    } else {
      console.warn("Table data or headers are undefined or empty.");
    }
  }, [open, selectedRow, tableData]);

  // Function to calculate total actuals for each revenue category
  const calculateTotals = () => {
    if (
      !selectedOU ||
      !selectedRow?.center ||
      !tableData?.length ||
      !headers?.length
    ) {
      console.warn("Missing required values for calculation");
      return;
    }

    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");

    if (ouIndex === -1 || centerIndex === -1 || accountIndex === -1) {
      console.error(
        "One or more necessary headers (OU, Center, Account) are missing."
      );
      return;
    }

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    let wholesaleSum = 0;
    let retailSum = 0;
    let concessionSum = 0;
    let leaseIncomeSum = 0;
    let otherIncomeSum = 0;

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

        // Check if "Account" starts with the category name
        if (accountName.startsWith("Wholesale")) {
          wholesaleSum += totalActual;
        } else if (accountName.startsWith("Retail")) {
          retailSum += totalActual;
        } else if (accountName.startsWith("Concession")) {
          concessionSum += totalActual;
        } else if (accountName.startsWith("Lease")) {
          leaseIncomeSum += totalActual;
        } else if (accountName.startsWith("Other")) {
          otherIncomeSum += totalActual;
        }
      }
    });

    setWholesaleTotal(wholesaleSum);
    setRetailTotal(retailSum);
    setConcessionTotal(concessionSum);
    setLeaseIncomeTotal(leaseIncomeSum);
    setOtherIncomeTotal(otherIncomeSum);
  };

  if (!open || !selectedRow?.center) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>{selectedRow.center} / Revenue</h2>
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
        <br />
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-icon">
            <svg
              width="24"
              height="24"
              fill="#2a5ed4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search Center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Revenue Categories */}
        <div className="category-container">
          <div className="category-box">
            <span className="category-name">Wholesale</span>
            <div className="category-total">
              <span className="total-label">Total Actual</span>
              <span className="total-value">
                {wholesaleTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="category-box">
            <span className="category-name">Retail</span>
            <div className="category-total">
              <span className="total-label">Total Actual</span>
              <span className="total-value">
                {retailTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="category-box">
            <span className="category-name">Concession</span>
            <div className="category-total">
              <span className="total-label">Total Actual</span>
              <span className="total-value">
                {concessionTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="category-box">
            <span className="category-name">Lease Income</span>
            <div className="category-total">
              <span className="total-label">Total Actual</span>
              <span className="total-value">
                {leaseIncomeTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="category-box">
            <span className="category-name">Other Income</span>
            <div className="category-total">
              <span className="total-label">Total Actual</span>
              <span className="total-value">
                {otherIncomeTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCategoryModal;
