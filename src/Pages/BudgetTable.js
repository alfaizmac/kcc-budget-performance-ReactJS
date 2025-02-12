import React, { useState, useEffect } from "react";
import "./BudgetTable.css";
import UploadButton from "../Components/UploadButton";
import FilterSection from "../Components/FilterSection";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

function BudgetTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ous, setOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  // Fetch uploaded files from Firestore
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "excelFiles"));
        const filesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(filesList);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  // Handle file selection and display its content
  const handleFileSelect = async (event) => {
    const fileUrl = event.target.value;
    setSelectedFile(fileUrl);
    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      setTableData(XLSX.utils.sheet_to_json(sheet, { header: 1 }));
    } catch (error) {
      console.error("Error reading Excel file:", error);
    }
  };

  return (
    <div className="BudgetTable">
      <h1>Budget Table</h1>
      <br />
      <FilterSection
        ous={ous}
        selectedOU={selectedOU}
        setSelectedOU={setSelectedOU}
      />

      <UploadButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setOUs={setOUs}
      />

      {/* File Selection Dropdown */}
      <h3>Select an Excel File:</h3>
      <select onChange={handleFileSelect} value={selectedFile || ""}>
        <option value="">-- Choose a File --</option>
        {files.map((file) => (
          <option key={file.id} value={file.url}>
            {file.name}
          </option>
        ))}
      </select>

      {/* Display Table */}
      {tableData.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              {tableData[0].map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BudgetTable;
