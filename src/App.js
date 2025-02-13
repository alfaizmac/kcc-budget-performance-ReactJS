import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import BudgetTable from "./Pages/BudgetTable";
import SideMenu from "./Components/SideMenu";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="main-container">
          <SideMenu />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/table" element={<BudgetTable />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
