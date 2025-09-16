import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  FitnessCenter,
  Schedule,
  TrendingUp,
  Today,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWorkout } from "../contexts/WorkoutContext";
import WorkoutRegistrationForm from "../components/WorkoutRegistrationForm";
import UserDetailsModal from "../components/UserDetailsModal";
import { useUserDetails } from "../contexts/UserDetailsContext";

const DashboardPage: React.FC = () => {
  const { userDetails, loading, error } = useUserDetails();
  const { workouts, sessions, handleStartWorkout, handleCreateWorkout } =
    useWorkout();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workoutFormOpen, setWorkoutFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  // Check if we need to show the modal for missing user details
  useEffect(() => {
    if (!loading && !error && !userDetails) {
      setModalOpen(true);
    }
  }, [loading, error, userDetails]);

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

  // Mock data for demonstration
  const weeklyGoal = 4; // workouts per week
  const completedThisWeek = 2;
  const progressPercentage = (completedThisWeek / weeklyGoal) * 100;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getWorkoutName = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    return workout ? workout.name : "Unknown Workout";
  };

  const handleCreateWorkoutClick = () => {
    setEditingWorkout(undefined);
    setWorkoutFormOpen(true);
  };

  const handleSubmitWorkout = (workoutData: any) => {
    handleCreateWorkout(workoutData);
    setWorkoutFormOpen(false);
  };

  const handleViewSchedule = () => {
    navigate("/schedule");
  };

  const handleSave = async () => {
    setModalOpen(false);
  };

  return (
    <>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {getGreeting()}, {user?.name?.split(" ")[0]}!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Ready to crush your fitness goals today?
        </Typography>

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FitnessCenter color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Workouts</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {workouts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available workouts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Schedule color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">This Week</Typography>
                </Box>
                <Typography variant="h4" color="secondary">
                  {completedThisWeek}/{weeklyGoal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workouts completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Streak</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  7
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Days in a row
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Today color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workouts completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FitnessCenter />}
                    onClick={handleCreateWorkoutClick}
                    fullWidth
                  >
                    Create New Workout
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Schedule />}
                    onClick={handleViewSchedule}
                    fullWidth
                  >
                    View Schedule
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                {sessions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No recent workouts. Start your first workout today!
                  </Typography>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {sessions.slice(0, 3).map((session) => (
                      <Box
                        key={session.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {getWorkoutName(session.workoutId)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {session.date.toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={session.completed ? "Completed" : "Incomplete"}
                          color={session.completed ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Workouts */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Recommended Workouts
                </Typography>
                {workouts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No workouts available. Create your first workout to get
                    started!
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {workouts.slice(0, 3).map((workout) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={workout.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {workout.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {workout.duration} minutes • {workout.difficulty}
                            </Typography>
                            <Chip
                              label={workout.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              onClick={() => handleStartWorkout(workout.id)}
                            >
                              Start Workout
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <WorkoutRegistrationForm
          open={workoutFormOpen}
          onClose={() => setWorkoutFormOpen(false)}
          onSubmit={handleSubmitWorkout}
          workout={editingWorkout}
        />
      </Box>
      <UserDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default DashboardPage;
