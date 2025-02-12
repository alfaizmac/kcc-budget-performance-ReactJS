import React, { useState } from "react";
import "./Modal.css";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Modal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    uploading: false,
    message: "",
  });

  if (!isOpen) return null;

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setUploadStatus({ uploading: true, message: "Uploading..." });

    try {
      const storageRef = ref(storage, `excelFiles/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          setUploadStatus({
            uploading: false,
            message: "Upload failed. Please try again.",
          });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "excelFiles"), {
            name: selectedFile.name,
            url: downloadURL,
            timestamp: serverTimestamp(),
          });

          setUploadStatus({
            uploading: false,
            message: "File uploaded successfully!",
          });

          setTimeout(() => {
            setUploadStatus({ uploading: false, message: "" });
            onClose();
          }, 1500);
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      setUploadStatus({
        uploading: false,
        message: "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>Upload Your Excel File</h2>
        <p>Upload your Excel file to store it in the database:</p>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="file-input"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button
          className="upload-btn"
          onClick={handleFileUpload}
          disabled={uploadStatus.uploading}
        >
          {uploadStatus.uploading ? "Uploading..." : "Upload"}
        </button>
        {uploadStatus.message && (
          <p className="upload-status">{uploadStatus.message}</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
