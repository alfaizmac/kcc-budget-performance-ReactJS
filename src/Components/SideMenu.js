import React from "react";
import { useNavigate } from "react-router-dom";
import "./SideMenu.css";

function SideMenu() {
  const navigate = useNavigate();

  return (
    <div className="sideMenu">
      <div className="projectTitle">
        <img src="/Img/Dashboard-KCC-Icon.png" alt="KCC icon" />
        <h2>Budget Performance Report</h2>
      </div>
      <div className="SideBarButtons">
        {/* Dashboard Button */}
        <button className="Dashboard" onClick={() => navigate("/")}>
          <svg
            className="Dashboar-btn"
            width="35"
            height="35"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14.06 10.69 12 9.75l2.06-.94.94-2.06.94 2.06 2.06.94-2.06.94-.94 2.06-.94-2.06ZM4 14.75l.94-2.06L7 11.75l-2.06-.94L4 8.75l-.94 2.06-2.06.94 2.06.94.94 2.06Zm4.5-5 1.09-2.41L12 6.25 9.59 5.16 8.5 2.75 7.41 5.16 5 6.25l2.41 1.09L8.5 9.75Zm-4 11.5 6-6.01 4 4L23 9.68l-1.41-1.41-7.09 7.97-4-4L3 19.75l1.5 1.5Z" />
          </svg>
          <span>Dashboard</span>
        </button>

        {/* Table Button */}
        <button className="SpreadSheetLink" onClick={() => navigate("/table")}>
          <svg
            className="Table-Btn"
            width="35"
            height="35"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 8h16V5H4v3Zm10 11v-9h-4v9h4Zm2 0h4v-9h-4v9Zm-8 0v-9H4v9h4ZM3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"></path>
          </svg>
          <span>Table</span>
        </button>

        {/* Sign Out Button */}
        <button className="SignOut">
          <svg
            className="SignOutBtn"
            width="35"
            height="35"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m17 8-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4ZM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5Z"></path>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default SideMenu;
