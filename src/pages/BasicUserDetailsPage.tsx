import React from "react";
import { Container, Box } from "@mui/material";
import BasicUserDetails from "../components/BasicUserDetails";

const BasicUserDetailsPage = () => {
  return (
    <div style={{ width: "20%" }}>
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <BasicUserDetails />
        </Box>
      </Container>
    </div>
  );
};

export default BasicUserDetailsPage;
