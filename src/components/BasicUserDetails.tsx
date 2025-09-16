import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import UserDetailsForm from "./UserDetailsForm";
import { UserDetails, useUserDetails } from "../contexts/UserDetailsContext";
import { userDetailsService } from "../services/userDetailsService";

const BasicUserDetails: React.FC = () => {
  const { userDetails, setUserDetails, loading, error } = useUserDetails();

  // Handle loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography>Loading user details...</Typography>
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography color="error">
          Error loading user details: {error}
        </Typography>
      </Box>
    );
  }

  const handleSave = (updatedData: UserDetails) => {
    updateData(updatedData);
  };

  const updateData = async (userDetails: UserDetails) => {
    try {
      const data = await userDetailsService.updateUserDetails(userDetails);
      // Update context with the saved details
      setUserDetails(data);
    } catch (error) {}
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Card>
        <CardContent>
          <UserDetailsForm initialData={userDetails} onSave={handleSave} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default BasicUserDetails;
