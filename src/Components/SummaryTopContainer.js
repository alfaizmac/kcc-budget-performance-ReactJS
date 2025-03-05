import React from "react";
import OUTableShowButton from "./BudgetTablePage/OUTableShowButton";
import "./SummaryTopContainer.css"; // Import the styles

const SummaryTopContainer = ({
  uniqueOUs,
  selectedOU,
  handleOUClick,
  totalBudget,
  totalActual,
  totalVariance,
  totalPercentage,
}) => {
  return (
    <div className="total-top-container">
      {/* Select OU */}
      <div className="total-box select-ou">
        <span className="total-title">Select OU</span>
        <OUTableShowButton
          uniqueOUs={uniqueOUs}
          selectedOU={selectedOU}
          handleOUClick={handleOUClick}
        />
      </div>

      {/* Total Actual */}
      <div className="total-box actual-box">
        <span className="total-title">Total Actual</span>
        <div className="divider"></div>
        <span className="label">Revenue</span>
        <span className="value">{totalActual.revenue.toLocaleString()}</span>
        <span className="label">Expenses</span>
        <span className="value">{totalActual.expenses.toLocaleString()}</span>
      </div>

      {/* Total Budget */}
      <div className="total-box budget-box">
        <span className="total-title">Total Budget</span>
        <div className="divider"></div>
        <span className="label">Revenue</span>
        <span className="value">{totalBudget.revenue.toLocaleString()}</span>
        <span className="label">Expenses</span>
        <span className="value">{totalBudget.expenses.toLocaleString()}</span>
      </div>

      {/* Total Variance */}
      <div className="total-box variance-box">
        <span className="total-title">Total Variance</span>
        <div className="divider"></div>
        <span className="label">Revenue</span>
        <span className="value">{totalVariance.revenue.toLocaleString()}</span>
        <span className="label">Expenses</span>
        <span className="value">{totalVariance.expenses.toLocaleString()}</span>
      </div>

      {/* Percentage */}
      <div className="total-box percentage-box">
        <span className="total-title">Percentage</span>
        <div className="divider"></div>
        <span className="label">Revenue</span>
        <span className="value">{totalPercentage.revenue}%</span>
        <span className="label">Expenses</span>
        <span className="value">{totalPercentage.expenses}%</span>
      </div>
    </div>
  );
};

export default SummaryTopContainer;
