import React from "react";
import "./UploadButton.css"; // Import the CSS file

function UploadButton({ setTableData, setHeaders }) {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate the file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload a valid Excel file (.xls or .xlsx).");
      return;
    }

    try {
      await setTableData(file);
    } catch (error) {
      alert(error); // Show the error from uploadExcel.js (invalid headers)
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
