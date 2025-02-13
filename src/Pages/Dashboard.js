import React, { useState, useEffect } from "react";
import FilterSection from "../Components/FilterSection";
import VarianceAnalysis from "../Components/VarianceAnalysis";
import FourContainer from "../Components/FourContainer";
import MonthlyRevenueExpenses from "../Components/MonthlyRevenueExpenses";
import TwoPieChart from "../Components/TwoPieChart";
import UploadButton from "../Components/UploadButton"; // Import UploadButton
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <br />
      <FilterSection />
      <br />
      <VarianceAnalysis />
      <br />
      <FourContainer />
      <br />
      <MonthlyRevenueExpenses />
      <br />
      <TwoPieChart />
      <br />

      {/* Upload Button Component */}
      <UploadButton />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
