import React, { useState } from "react";
import AccountTable from "./AccountTable"; // Import modal component
import "./OUTable.css"; // Unified CSS file

const CenterSummary = ({ selectedOU, centerSummary, searchTerm }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleBoxClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Filter centers based on search term
  const filteredCenters = centerSummary.filter((row) =>
    row.center.toLowerCase().includes(searchTerm)
  );

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
                <div className="total-box" onClick={() => handleBoxClick(row)}>
                  <div className="total-title">Total Revenue</div>
                  <div className="total-value">{row.revenue}</div>
                </div>
                <div className="total-box" onClick={() => handleBoxClick(row)}>
                  <div className="total-title">Total Expenses</div>
                  <div className="total-value">{row.expenses}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No centers found</p> // Display message if no matches
        )}
      </div>

      {/* AccountTable Modal */}
      <AccountTable
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default CenterSummary;
