import React, { useState, useEffect } from "react";
import FilterSection from "../Components/FilterSection";
import VarianceAnalysis from "../Components/DashboardPage/VarianceAnalysis";
import FourContainer from "../Components/DashboardPage/FourContainer";
import MonthlyRevenueExpenses from "../Components/DashboardPage/MonthlyRevenueExpenses";
import TwoPieChart from "../Components/DashboardPage/TwoPieChart";
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
