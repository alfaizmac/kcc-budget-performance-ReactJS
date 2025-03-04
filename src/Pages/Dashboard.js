import React, { useState, useEffect } from "react";
import UploadButton from "../Components/UploadButton"; // Import UploadButton
import SummaryTopContainer from "../Components/SummaryTopContainer"; // Import SummaryTopContainer
import "./Dashboard.css";

function Dashboard() {
  // State for storing budget summary values
  const [totalBudget, setTotalBudget] = useState({ revenue: 0, expenses: 0 });
  const [totalActual, setTotalActual] = useState({ revenue: 0, expenses: 0 });
  const [totalVariance, setTotalVariance] = useState({
    revenue: 0,
    expenses: 0,
  });
  const [totalPercentage, setTotalPercentage] = useState({
    revenue: 0,
    expenses: 0,
  });

  // State for storing OU (Organizational Unit) data
  const [uniqueOUs, setUniqueOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState(null);

  // Function to handle OU selection
  const handleOUClick = (ou) => {
    setSelectedOU(ou);
    // TODO: Fetch and update budget summary values for the selected OU
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <br />

      <UploadButton />

      {/* Include SummaryTopContainer */}
      <SummaryTopContainer
        uniqueOUs={uniqueOUs}
        selectedOU={selectedOU}
        handleOUClick={handleOUClick}
        totalBudget={totalBudget}
        totalActual={totalActual}
        totalVariance={totalVariance}
        totalPercentage={totalPercentage}
      />
    </div>
  );
}

export default Dashboard;
