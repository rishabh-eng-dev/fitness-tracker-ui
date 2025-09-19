import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { authService } from "../services/authService";

const AuthSuccessPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuthSuccess = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");

        if (!accessToken || !refreshToken) {
          throw new Error("Missing authentication tokens");
        }

        // Handle the OAuth response
        authService.handleDirectOAuthResponse({ accessToken, refreshToken });

        // Small delay to ensure auth state is updated, then redirect
        setTimeout(() => {
          const preAuthUrl = localStorage.getItem("preAuthUrl") || "/dashboard";
          localStorage.removeItem("preAuthUrl");
          window.location.href = preAuthUrl;
        }, 1000);
      } catch (error) {
        console.error("Auth success processing error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed"
        );

        // Redirect to login after error
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    };

    processAuthSuccess();
  }, []);

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={2}
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Redirecting to login page...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Completing sign in...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we set up your account.
      </Typography>
    </Box>
  );
};

export default AuthSuccessPage;
