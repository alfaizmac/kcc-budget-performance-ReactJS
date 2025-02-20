import React from "react";
import BudgetTableDisplay from "../Components/BudgetTablePage/BudgetTableDisplay";
import "./BudgetTable.css";

function BudgetTable() {
  return (
    <div className="budget-table-page">
      <h1>Budget Table</h1>
      <br />
      <BudgetTableDisplay />
    </div>
  );
}

export default BudgetTable;
