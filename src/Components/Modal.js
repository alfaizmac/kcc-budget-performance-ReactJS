import React, { useState } from "react";
import UploadExcel from "../utils/uploadExcel";
import "./Modal.css";

function Modal({ isOpen, onClose, setTableData, setHeaders }) {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      const { headers, data } = await UploadExcel(file);
      setHeaders(headers);
      setTableData(data);
      setErrorMessage(""); // Clear any previous errors
      onClose(); // Close modal after successful upload
    } catch (error) {
      setErrorMessage(error); // Show error if the file is empty or invalid
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "show" : ""}`}>
      <div className="modal-content">
        <h2>Upload Excel File</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleFileUpload} disabled={!file}>
          Upload
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
