import React, { useState } from "react";
import AccountTable from "./AccountTable"; // Import the modal component
import "./OUTable.css"; // Import the CSS file

const CenterSummary = ({ selectedOU, centerSummary }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleBoxClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="center-summary-container">
      <div className="center-summary-list">
        {centerSummary.map((row, index) => (
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
        ))}
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
