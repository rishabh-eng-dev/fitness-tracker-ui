import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Divider,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { loginOAuth, loginEmailPassword, isLoading, error, clearError } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    // email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    // password validation
    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setPasswordError(
          "Password must be at least 8 characters long, contain uppercase, lowercase, and a special symbol"
        );
        valid = false;
      } else {
        setPasswordError("");
      }
    }

    return valid;
  };

  const handleOAuthLogin = async (type: string) => {
    try {
      await loginOAuth(type);
    } catch (error) {
      console.error("OAuth login failed:", error);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await loginEmailPassword(email, password);
    } catch (error) {
      console.error("Email login failed:", error);
    }
  };

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

          {/* Email + Password Login */}
          <Box
            component="form"
            onSubmit={handleEmailLogin}
            sx={{ width: "100%", mb: 3 }}
            noValidate // <-- disables browser default validation
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth
              sx={{ mt: 2, py: 1.5, fontSize: "1.1rem" }}
            >
              {isLoading ? "Signing in..." : "Sign in with Email"}
            </Button>
          </Box>

          <Divider sx={{ width: "100%", my: 2 }}>OR</Divider>

          {/* Google Login */}
          <Button
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} /> : <Google />}
            onClick={() => handleOAuthLogin("google")}
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
