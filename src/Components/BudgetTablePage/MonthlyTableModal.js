import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import "./MonthlyTableModal.css"; // Ensure this CSS file exists

const MonthlyTableModal = ({
  open,
  handleClose,
  selectedAccount,
  selectedRow,
  headers,
  tableData,
}) => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (
      selectedAccount &&
      selectedRow &&
      headers.length > 0 &&
      tableData.length > 0
    ) {
      filterMonthlyData();
    }
  }, [selectedAccount, selectedRow, headers, tableData]);

  const filterMonthlyData = () => {
    if (!selectedAccount || !selectedRow) return;

    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");
    const subAccountIndex = headers.indexOf("Sub-Account");

    const isRevenue = selectedRow.type === "revenue";
    const nameIndex = isRevenue ? accountIndex : subAccountIndex;

    // Month names and their corresponding headers in the Excel file
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthHeaders = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthData = monthNames.map((month, index) => ({
      month,
      budget: "0",
      actual: "0",
      variance: "0",
      percent: "0%",
    }));

    tableData.forEach((row) => {
      if (
        row[centerIndex] === selectedRow.center &&
        row[nameIndex] === selectedAccount.name
      ) {
        monthHeaders.forEach((prefix, index) => {
          const budgetIndex = headers.indexOf(`${prefix}_Budget`);
          const actualIndex = headers.indexOf(`${prefix}_Actual`);
          const varianceIndex = headers.indexOf(`${prefix}_Variance`);
          const percentIndex = headers.indexOf(`${prefix}_Percent`);

          if (budgetIndex !== -1)
            monthData[index].budget = formatNumber(row[budgetIndex] || 0);
          if (actualIndex !== -1)
            monthData[index].actual = formatNumber(row[actualIndex] || 0);
          if (varianceIndex !== -1)
            monthData[index].variance = formatNumber(row[varianceIndex] || 0);
          if (percentIndex !== -1)
            monthData[index].percent = formatPercent(row[percentIndex] || 0);
        });
      }
    });

    setMonthlyData(monthData);
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (num) => {
    return `${parseInt(num * 100, 10)}%`; // Convert decimal to whole number percentage
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 600,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: "12px",
          overflowY: "auto",
        }}
      >
        {/* Modal Title */}
        <Typography
          variant="h4"
          sx={{ color: "#2a5ed4", textAlign: "center", mb: 2 }}
        >
          {selectedRow?.center} /{" "}
          {selectedRow?.type === "revenue" ? "Revenue" : "Expenses"} /{" "}
          {selectedAccount?.name}
        </Typography>

        {/* Table Container */}
        <div className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Month</TableCell>
                <TableCell className="table-header">Budget</TableCell>
                <TableCell className="table-header">Actual</TableCell>
                <TableCell className="table-header">Variance</TableCell>
                <TableCell className="table-header">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyData.map((row, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.budget}</TableCell>
                  <TableCell>{row.actual}</TableCell>
                  <TableCell>{row.variance}</TableCell>
                  <TableCell>{row.percent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Box>
    </Modal>
  );
};

export default MonthlyTableModal;
