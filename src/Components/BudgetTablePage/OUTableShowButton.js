import React from "react";
import { Button } from "@mui/material";

function OUtable({ uniqueOUs, selectedOU, handleOUClick }) {
  return (
    <div className="OUtable">
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
    </div>
  );
}

export default OUtable;
