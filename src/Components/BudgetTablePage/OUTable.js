import React, { useState } from "react";
import AccountTableModal from "./AccountTableModal"; // Import modal component
import "./OUTable.css"; // Unified CSS file

const CenterSummary = ({
  selectedOU,
  centerSummary,
  searchTerm,
  headers,
  tableData,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  // Function to format numbers with commas
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Filter centers based on search term
  const filteredCenters = centerSummary.filter((row) =>
    row.center.toLowerCase().includes(searchTerm)
  );

  const handleBoxClick = (row, type) => {
    setSelectedRow({ ...row, type }); // Add type: "revenue" or "expenses"
    setOpen(true);
  };

  return (
    <div className="center-summary-container">
      <div className="center-summary-list">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((row, index) => (
            <div key={index} className="center-summary">
              <div className="center-details">
                <div className="center-title">Center Name</div>
                <div className="center-name">{row.center}</div>
              </div>
              <div className="center-totals">
                <div
                  className="total-box"
                  onClick={() => handleBoxClick(row, "revenue")}
                >
                  <div className="total-title">Total Revenue</div>
                  <div className="total-value">{formatNumber(row.revenue)}</div>
                </div>
                <div
                  className="total-box"
                  onClick={() => handleBoxClick(row, "expenses")}
                >
                  <div className="total-title">Total Expenses</div>
                  <div className="total-value">
                    {formatNumber(row.expenses)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No centers found</p> // Display message if no matches
        )}
      </div>

      {/* AccountTable Modal */}
      <AccountTableModal
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
        headers={headers} // Pass headers
        tableData={tableData} // Pass table data
      />
    </div>
  );
};

export default CenterSummary;
