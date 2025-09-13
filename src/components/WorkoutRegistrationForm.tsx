import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Workout, Exercise } from "../types/workout";

interface WorkoutRegistrationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (workout: Omit<Workout, "id" | "createdAt" | "updatedAt">) => void;
  workout?: Workout;
}

const WorkoutRegistrationForm: React.FC<WorkoutRegistrationFormProps> = ({
  open,
  onClose,
  onSubmit,
  workout,
}) => {
  const [formData, setFormData] = useState({
    name: workout?.name || "",
    description: workout?.description || "",
    duration: workout?.duration || 30,
    difficulty: workout?.difficulty || "beginner",
    category: workout?.category || "mixed",
    exercises: workout?.exercises || [],
  });

  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    reps: 10,
    duration: 0,
    weight: 0,
    restTime: 60,
    notes: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExerciseChange = (field: string, value: any) => {
    setNewExercise((prev) => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    if (newExercise.name.trim()) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newExercise.name,
        sets: newExercise.sets,
        reps: newExercise.reps,
        duration: newExercise.duration || undefined,
        weight: newExercise.weight || undefined,
        restTime: newExercise.restTime || undefined,
        notes: newExercise.notes || undefined,
      };

      setFormData((prev) => ({
        ...prev,
        exercises: [...prev.exercises, exercise],
      }));

      setNewExercise({
        name: "",
        sets: 3,
        reps: 10,
        duration: 0,
        weight: 0,
        restTime: 60,
        notes: "",
      });
    }
  };

  const removeExercise = (exerciseId: string) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const handleSubmit = () => {
    if (formData.name.trim() && formData.exercises.length > 0) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {workout ? "Edit Workout" : "Create New Workout"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Basic Information */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Workout Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  handleInputChange(
                    "duration",
                    parseInt(String(e.target.value))
                  )
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
                  }
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                >
                  <MenuItem value="cardio">Cardio</MenuItem>
                  <MenuItem value="strength">Strength</MenuItem>
                  <MenuItem value="flexibility">Flexibility</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Add Exercise Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Add Exercise
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Exercise Name"
                  value={newExercise.name}
                  onChange={(e) => handleExerciseChange("name", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Sets"
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) =>
                    handleExerciseChange(
                      "sets",
                      parseInt(String(e.target.value))
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Reps"
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) =>
                    handleExerciseChange(
                      "reps",
                      parseInt(String(e.target.value))
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={newExercise.weight}
                  onChange={(e) =>
                    handleExerciseChange(
                      "weight",
                      parseFloat(String(e.target.value))
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Rest Time (sec)"
                  type="number"
                  value={newExercise.restTime}
                  onChange={(e) =>
                    handleExerciseChange(
                      "restTime",
                      parseInt(String(e.target.value))
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={newExercise.notes}
                  onChange={(e) =>
                    handleExerciseChange("notes", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addExercise}
                  disabled={!newExercise.name.trim()}
                >
                  Add Exercise
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Exercise List */}
          {formData.exercises.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Exercises ({formData.exercises.length})
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {formData.exercises.map((exercise) => (
                  <Box
                    key={exercise.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {exercise.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Chip label={`${exercise.sets} sets`} size="small" />
                        <Chip label={`${exercise.reps} reps`} size="small" />
                        {exercise.weight && (
                          <Chip label={`${exercise.weight} kg`} size="small" />
                        )}
                        {exercise.restTime && (
                          <Chip
                            label={`${exercise.restTime}s rest`}
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removeExercise(exercise.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.trim() || formData.exercises.length === 0}
        >
          {workout ? "Update" : "Create"} Workout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkoutRegistrationForm;
