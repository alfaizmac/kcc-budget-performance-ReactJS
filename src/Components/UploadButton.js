import React from "react";
import UploadExcel from "../utils/uploadExcel";
import "./UploadButton.css"; // Import the CSS file

function UploadButton({ setTableData, setHeaders }) {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { headers, data } = await UploadExcel(file);
      if (setHeaders) setHeaders(headers);
      if (setTableData) setTableData(data);

      // Save to localStorage
      localStorage.setItem("budgetHeaders", JSON.stringify(headers));
      localStorage.setItem("budgetTableData", JSON.stringify(data));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="upload-button-container">
      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        id="file-upload"
        style={{ display: "none" }}
      />

      {/* Visible Upload Button */}
      <label htmlFor="file-upload">
        <svg viewBox="0 0 24 24">
          <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2ZM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5Z"></path>
        </svg>
      </label>
    </div>
  );
}

export default UploadButton;
