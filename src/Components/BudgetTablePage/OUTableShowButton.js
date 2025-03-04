import React from "react";

function OUTableShowButton({ uniqueOUs, selectedOU, handleOUClick }) {
  return (
    <div className="ou-container">
      <div className="ou-buttons">
        {uniqueOUs.map((ou, index) => (
          <button
            key={index}
            className={`ou-button ${selectedOU === ou ? "selected" : ""}`}
            onClick={() => handleOUClick(ou)}
          >
            {ou}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OUTableShowButton;
