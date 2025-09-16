import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { User } from "../types/auth";
import { Logout } from "@mui/icons-material";

const AccountInfo: React.FC<{
  user: User | null;
  handleLogout: () => void;
}> = ({ user, handleLogout }) => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">
              {user?.name || "Guest User"}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {user?.email || "guest@example.com"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            color="error"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AccountInfo;
