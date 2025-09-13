import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const handleSkipLogin = () => {
  //   // For testing purposes, trigger a dummy login
  //   window.location.reload();
  // };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Workout Tracker
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Track your workouts, create schedules, and get AI-powered fitness
            advice. Sign in to get started!
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ width: "100%", mb: 2 }}
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} /> : <Google />}
            onClick={handleLogin}
            disabled={isLoading}
            size="large"
            sx={{
              width: "100%",
              py: 1.5,
              fontSize: "1.1rem",
              backgroundColor: "#4285f4",
              "&:hover": {
                backgroundColor: "#3367d6",
              },
            }}
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3, textAlign: "center" }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
