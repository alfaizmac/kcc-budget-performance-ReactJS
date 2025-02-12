import React from "react";
import "./ExcelFilesPage.css";

const ExcelFilesPage = () => {
  return (
    <div className="excel-files-container">
      <h1>Manage Uploaded Excel Files</h1>

      <table className="excel-files-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Excel files will be mapped here */}
          <tr>
            <td>SampleFile.xlsx</td>
            <td>
              <button className="delete-btn">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExcelFilesPage;
