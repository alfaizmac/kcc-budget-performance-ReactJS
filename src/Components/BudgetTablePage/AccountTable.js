import React from "react";
import { Modal, Box, Typography } from "@mui/material";

const AccountTable = ({ open, handleClose, selectedRow }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Typography variant="h1">Hello</Typography>
      </Box>
    </Modal>
  );
};

export default AccountTable;
