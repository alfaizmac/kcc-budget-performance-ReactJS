import React from "react";
import GraphDisplay from "../Components/DashboardPage/GraphDisplay";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <br />
      <GraphDisplay />
    </div>
  );
}

export default Dashboard;
