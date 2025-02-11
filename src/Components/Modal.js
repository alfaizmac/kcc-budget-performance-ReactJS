import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>Upload Your File</h2>
        <p>
          You can upload your Excel file or input
          <br /> a spreadsheet public link below:
        </p>
        <input type="file" accept=".xlsx, .xls" className="file-input" />
        <input
          type="text"
          placeholder="Enter spreadsheet link"
          className="link-input"
        />
        <button className="upload-btn">Upload</button>
      </div>
    </div>
  );
};

export default Modal;
