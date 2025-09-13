import React, { useState } from "react";
import { Grid, Box, Typography, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import WorkoutCard from "./WorkoutCard";
import { useWorkout } from "../contexts/WorkoutContext";
import WorkoutRegistrationForm from "./WorkoutRegistrationForm";

const WorkoutList: React.FC = () => {
  const { workouts, handleStartWorkout, handleCreateWorkout } = useWorkout();
  const [workoutFormOpen, setWorkoutFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(undefined);

  const handleCreateWorkoutClick = () => {
    setEditingWorkout(undefined);
    setWorkoutFormOpen(true);
  };

  const handleSubmitWorkout = (workoutData: any) => {
    handleCreateWorkout(workoutData);
    setWorkoutFormOpen(false);
  };
  if (workouts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No workouts yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create your first workout to get started!
        </Typography>
        <Fab color="primary" onClick={handleCreateWorkoutClick}>
          <Add />
        </Fab>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          My Workouts
        </Typography>
        <Fab color="primary" onClick={handleCreateWorkoutClick}>
          <Add />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {workouts.map((workout) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={workout.id}>
            <WorkoutCard
              workout={workout}
              onStartWorkout={handleStartWorkout}
              onEditWorkout={(id) => console.log("Edit workout", id)}
            />
          </Grid>
        ))}
      </Grid>

      <WorkoutRegistrationForm
        open={workoutFormOpen}
        onClose={() => setWorkoutFormOpen(false)}
        onSubmit={handleSubmitWorkout}
        workout={editingWorkout}
      />
    </Box>
  );
};

export default WorkoutList;
