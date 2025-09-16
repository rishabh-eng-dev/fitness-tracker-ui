import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import WorkoutList from "./components/WorkoutList";
import WorkoutSchedule from "./components/WorkoutSchedule";
import Chatbot from "./components/Chatbot";
import AuthSuccessPage from "./pages/AuthSuccessPage";
import { UserDetailsProvider } from "./contexts/UserDetailsContext";
import BasicUserDetails from "./components/BasicUserDetails";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/success" element={<AuthSuccessPage />} />

      {/* Protected routes - require authentication */}
      {isAuthenticated ? (
        <Route
          path="/*"
          element={
            <WorkoutProvider>
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/user" element={<BasicUserDetails />} />
                  <Route path="/workouts" element={<WorkoutList />} />
                  <Route path="/schedule" element={<WorkoutSchedule />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/chat" element={<Chatbot />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            </WorkoutProvider>
          }
        />
      ) : (
        // Redirect unauthenticated users to login (except for public routes above)
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UserDetailsProvider>
          <Router>
            <AppContent />
          </Router>
        </UserDetailsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
