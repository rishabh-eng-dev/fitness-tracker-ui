import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  Schedule,
  FitnessCenter,
  MoreVert,
} from "@mui/icons-material";
import { Workout } from "../types/workout";

interface WorkoutCardProps {
  workout: Workout;
  onStartWorkout: (workoutId: string) => void;
  onEditWorkout: (workoutId: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onStartWorkout,
  onEditWorkout,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cardio":
        return "🏃";
      case "strength":
        return "💪";
      case "flexibility":
        return "🧘";
      case "mixed":
        return "🏋️";
      default:
        return "💪";
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
            {workout.name}
          </Typography>
          <IconButton size="small" onClick={() => onEditWorkout(workout.id)}>
            <MoreVert />
          </IconButton>
        </Box>

        {workout.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {workout.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={workout.difficulty}
            color={getDifficultyColor(workout.difficulty) as any}
            size="small"
          />
          <Chip
            label={`${getCategoryIcon(workout.category)} ${workout.category}`}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Schedule fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {workout.duration} minutes
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FitnessCenter fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {workout.exercises.length} exercises
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={() => onStartWorkout(workout.id)}
          sx={{ flexGrow: 1 }}
        >
          Start Workout
        </Button>
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
