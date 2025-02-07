import React from "react";
import "./SideMenu.css";

function SideMenu() {
  return (
    <div className="sideMenu">
      <div className="projectTitle">
        <img src="/Img/Dashboard-KCC-Icon.png" alt="KCC icon" />
        <h2>Budget Performance Report</h2>
      </div>
      <div className="SideBarButtons">
        <button className="Dashboard">
          <svg
            width="44"
            height="44"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14.06 10.69 12 9.75l2.06-.94.94-2.06.94 2.06 2.06.94-2.06.94-.94 2.06-.94-2.06ZM4 14.75l.94-2.06L7 11.75l-2.06-.94L4 8.75l-.94 2.06-2.06.94 2.06.94.94 2.06Zm4.5-5 1.09-2.41L12 6.25 9.59 5.16 8.5 2.75 7.41 5.16 5 6.25l2.41 1.09L8.5 9.75Zm-4 11.5 6-6.01 4 4L23 9.68l-1.41-1.41-7.09 7.97-4-4L3 19.75l1.5 1.5Z" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button className="SpreadSheetLink">
          <svg
            width="44"
            height="44"
            fill="#2a5ed4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.19 12.345a.97.97 0 0 1 1.654.684.966.966 0 0 1-.284.683l-2.055 2.052a1.932 1.932 0 0 0 1.37 3.302 1.94 1.94 0 0 0 1.37-.567l4.795-4.787a.966.966 0 0 0 0-1.367.967.967 0 1 1 1.37-1.368 2.899 2.899 0 0 1 0 4.103l-4.796 4.787a3.879 3.879 0 0 1-6.32-1.254 3.864 3.864 0 0 1 .84-4.216l2.056-2.053v.001Zm11.62-.69a.97.97 0 0 1-1.653-.683.965.965 0 0 1 .284-.684l2.055-2.052a1.932 1.932 0 0 0-1.37-3.301 1.94 1.94 0 0 0-1.37.566l-4.793 4.787a.964.964 0 0 0 0 1.367.965.965 0 0 1 0 1.368.97.97 0 0 1-1.37 0 2.899 2.899 0 0 1 0-4.103l4.794-4.787a3.879 3.879 0 0 1 6.32 1.255 3.863 3.863 0 0 1-.84 4.215l-2.056 2.053Z"></path>
          </svg>
          <span>SpreadSheets Links</span>
        </button>
        <button className="SignOut">
          <svg
            width="44"
            height="44"
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
