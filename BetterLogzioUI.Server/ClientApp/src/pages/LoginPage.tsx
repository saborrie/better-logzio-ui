import { Box } from "@mui/material";
import React from "react";

import AddAccountDialog from "../components/AddAccountDialog";

function LoginPage() {
  return (
    <Box
    // sx={{
    //   height: "100vh",
    //   width: "100vw",
    //   overflow: "hidden",
    //   display: "flex",
    //   flexDirection: "column",
    //   alignItems: "center",
    //   justifyContent: "center",
    // }}
    >
      <AddAccountDialog open onClose={() => {}} />
    </Box>
  );
}

export default LoginPage;
