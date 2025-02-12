import React, { useState } from "react";
import "./Modal.css";
import { parseExcelFile, getUniqueOUs } from "./fetchSpreadsheetData";

const Modal = ({ isOpen, onClose, setOUs }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      const data = await parseExcelFile(selectedFile);
      const uniqueOUs = getUniqueOUs(data);
      setOUs(uniqueOUs);
      setSuccessMessage("File uploaded successfully!");

      // Hide modal after a delay
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      setSuccessMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>Upload Your File</h2>
        <p>Upload your Excel file to extract OU values:</p>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="file-input"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button className="upload-btn" onClick={handleFileUpload}>
          Upload
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Modal;
