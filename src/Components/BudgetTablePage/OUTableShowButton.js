import React, { useEffect } from "react";

function OUTableShowButton({ uniqueOUs, selectedOU, handleOUClick }) {
  // Load the selected OU from localStorage when the component mounts
  useEffect(() => {
    const storedOU = localStorage.getItem("selectedOU");
    if (storedOU && uniqueOUs.includes(storedOU)) {
      handleOUClick(storedOU);
    }
  }, [uniqueOUs]);

  // Save the selected OU in localStorage whenever it changes
  const handleSelectOU = (ou) => {
    localStorage.setItem("selectedOU", ou);
    handleOUClick(ou);
  };

  return (
    <div className="ou-container">
      <div className="ou-buttons">
        {uniqueOUs.map((ou, index) => (
          <button
            key={index}
            className={`ou-button ${selectedOU === ou ? "selected" : ""}`}
            onClick={() => handleSelectOU(ou)}
          >
            {ou}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OUTableShowButton;
