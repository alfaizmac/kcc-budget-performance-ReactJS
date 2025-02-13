import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import UploadButton from "../Components/UploadButton";
import "./BudgetTable.css";

function BudgetTable() {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [uniqueOUs, setUniqueOUs] = useState([]);
  const [selectedOU, setSelectedOU] = useState(null);
  const [centerSummary, setCenterSummary] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [detailedData, setDetailedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedHeaders = localStorage.getItem("budgetHeaders");
    const storedData = localStorage.getItem("budgetTableData");

    if (storedHeaders && storedData) {
      const parsedHeaders = JSON.parse(storedHeaders);
      const parsedData = JSON.parse(storedData);
      setHeaders(parsedHeaders);
      setTableData(parsedData);
    }
  }, []);

  useEffect(() => {
    if (headers.length > 0 && tableData.length > 0) {
      localStorage.setItem("budgetHeaders", JSON.stringify(headers));
      localStorage.setItem("budgetTableData", JSON.stringify(tableData));
      extractUniqueOUs(tableData);
    }
  }, [headers, tableData]);

  const extractUniqueOUs = (data) => {
    const ouIndex = headers.indexOf("OU");
    if (ouIndex !== -1 && data.length > 0) {
      const ouList = [...new Set(data.map((row) => row[ouIndex]))];
      setUniqueOUs(ouList);
    }
  };

  const handleOUClick = (ou) => {
    setSelectedOU(ou);
    setSelectedCenter(null);
    setSelectedType(null);
    setDetailedData([]);
    const ouIndex = headers.indexOf("OU");
    if (ouIndex !== -1 && tableData.length > 0) {
      const filtered = tableData.filter((row) => row[ouIndex] === ou);
      calculateCenterSummary(filtered);
    }
  };

  const calculateCenterSummary = (filteredData) => {
    const centerIndex = headers.indexOf("Center");
    const subAccountIndex = headers.indexOf("Sub-Account");
    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    const summary = {};

    filteredData.forEach((row) => {
      const center = row[centerIndex];
      const subAccount = row[subAccountIndex];
      const isRevenue = subAccount === "Null";

      if (!summary[center]) {
        summary[center] = { revenue: 0, expenses: 0 };
      }

      const totalActual = actualIndexes.reduce(
        (sum, i) => sum + parseFloat(row[i] || 0),
        0
      );

      if (isRevenue) {
        summary[center].revenue += totalActual;
      } else {
        summary[center].expenses += totalActual;
      }
    });

    setCenterSummary(
      Object.entries(summary).map(([center, values]) => ({
        center,
        revenue: values.revenue,
        expenses: values.expenses,
      }))
    );
  };

  const handleRowClick = (center, type) => {
    setSelectedCenter(center);
    setSelectedType(type);
    const centerIndex = headers.indexOf("Center");
    const subAccountIndex = headers.indexOf("Sub-Account");
    const budgetIndexes = headers
      .map((header, i) => (header.includes("Budget") ? i : -1))
      .filter((i) => i !== -1);
    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);
    const varianceIndexes = headers
      .map((header, i) => (header.includes("Variance") ? i : -1))
      .filter((i) => i !== -1);

    const filteredData = tableData.filter((row) => {
      const isRevenue = row[subAccountIndex] === "Null";
      return (
        row[centerIndex] === center &&
        (type === "Revenue" ? isRevenue : !isRevenue)
      );
    });

    const details = budgetIndexes.map((budgetIdx, i) => ({
      month: headers[budgetIdx].split("_")[0],
      budget: filteredData.reduce(
        (sum, row) => sum + parseFloat(row[budgetIdx] || 0),
        0
      ),
      actual: filteredData.reduce(
        (sum, row) => sum + parseFloat(row[actualIndexes[i]] || 0),
        0
      ),
      variance: filteredData.reduce(
        (sum, row) => sum + parseFloat(row[varianceIndexes[i]] || 0),
        0
      ),
    }));

    setDetailedData(details);
  };

  return (
    <div className="BudgetTable">
      <h1>Budget Table</h1>
      <UploadButton setTableData={setTableData} setHeaders={setHeaders} />
      <br />
      <div className="ou-buttons">
        {uniqueOUs.map((ou, index) => (
          <Button
            key={index}
            variant={selectedOU === ou ? "contained" : "outlined"}
            onClick={() => handleOUClick(ou)}
          >
            {ou}
          </Button>
        ))}
      </div>
      <br />
      <div className="tables">
        <div className="DataTable">
          {selectedOU && <h2>Selected OU: {selectedOU}</h2>}
          <br />
          <TextField
            label="Search Center"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <br />
          <br />
          {selectedOU && centerSummary.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Center Name</TableCell>
                    <TableCell>Expenses</TableCell>
                    <TableCell>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centerSummary.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.center}</TableCell>
                      <TableCell
                        onClick={() => handleRowClick(row.center, "Expenses")}
                        style={{ cursor: "pointer" }}
                      >
                        {row.expenses.toFixed(2)}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(row.center, "Revenue")}
                        style={{ cursor: "pointer" }}
                      >
                        {row.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            selectedOU && <p>No data available for this OU.</p>
          )}
        </div>
        {selectedCenter && (
          <div className="DetailsTable">
            <h2>
              {selectedCenter} - {selectedType} Details
            </h2>
            <br />
            <br />
            <br />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Actual</TableCell>
                    <TableCell>Variance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.budget.toFixed(2)}</TableCell>
                      <TableCell>{row.actual.toFixed(2)}</TableCell>
                      <TableCell>{row.variance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default BudgetTable;
