import React from "react";
import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";
import { History as HistoryIcon, FitnessCenter } from "@mui/icons-material";
import { useWorkout } from "../contexts/WorkoutContext";

const HistoryPage: React.FC = () => {
  const { sessions, workouts } = useWorkout();
  const getWorkoutName = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    return workout ? workout.name : "Unknown Workout";
  };

  const getWorkoutCategory = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    return workout ? workout.category : "unknown";
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <HistoryIcon sx={{ mr: 2, fontSize: 32 }} color="primary" />
        <Typography variant="h4" component="h1">
          Workout History
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your progress and see all your completed workouts.
      </Typography>

      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <FitnessCenter
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No workout history yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete your first workout to see it here!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {sortedSessions.map((session) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="h3">
                      {getWorkoutName(session.workoutId)}
                    </Typography>
                    <Chip
                      label={session.completed ? "Completed" : "Incomplete"}
                      color={session.completed ? "success" : "default"}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {session.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Duration: {session.duration} minutes
                  </Typography>

                  <Chip
                    label={getWorkoutCategory(session.workoutId)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HistoryPage;
