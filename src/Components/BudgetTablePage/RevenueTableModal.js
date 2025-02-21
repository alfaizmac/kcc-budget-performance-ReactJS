import React from "react";
import { Modal, Box, Typography } from "@mui/material";

const RevenueTableModal = ({ open, handleClose, selectedRow }) => {
  if (!selectedRow) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: "12px",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", color: "#2a5ed4" }}>
          {selectedRow.center} /{" "}
          {selectedRow.type === "revenue" ? "Revenue" : "Expenses"}
        </Typography>
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          More details will be displayed here...
        </Typography>
      </Box>
    </Modal>
  );
};

export default RevenueTableModal;
