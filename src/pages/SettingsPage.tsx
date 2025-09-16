import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  Alert,
} from "@mui/material";
import { Save, Settings as SettingsIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import AccountInfo from "../components/AccountInfo";
import { useState } from "react";

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    workoutReminders: true,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: 32 }} color="primary" />
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account settings and preferences.
      </Typography>

      <Grid container spacing={3}>
        <AccountInfo user={user} handleLogout={handleLogout} />
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={() => handleSettingChange("notifications")}
                  />
                }
                label="Push Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={() => handleSettingChange("darkMode")}
                  />
                }
                label="Dark Mode"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailUpdates}
                    onChange={() => handleSettingChange("emailUpdates")}
                  />
                }
                label="Email Updates"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.workoutReminders}
                    onChange={() => handleSettingChange("workoutReminders")}
                  />
                }
                label="Workout Reminders"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                Changes are automatically saved to your account.
              </Alert>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                size="large"
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
