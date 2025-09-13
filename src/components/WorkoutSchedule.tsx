import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Edit, Delete, CalendarToday } from "@mui/icons-material";
import {
  WorkoutSchedule as WorkoutScheduleType,
  ScheduledWorkout,
} from "../types/workout";
import { useWorkout } from "../contexts/WorkoutContext";

const WorkoutSchedule: React.FC = () => {
  const {
    schedules,
    workouts,
    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,
  } = useWorkout();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<WorkoutScheduleType | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    workouts: [] as ScheduledWorkout[],
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const openCreateDialog = () => {
    setScheduleForm({
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      workouts: [],
    });
    setCreateDialogOpen(true);
  };

  const handleEditSchedule = (schedule: WorkoutScheduleType) => {
    setSelectedSchedule(schedule);
    setScheduleForm({
      name: schedule.name,
      startDate: schedule.startDate.toISOString().split("T")[0],
      endDate: schedule.endDate?.toISOString().split("T")[0] || "",
      workouts: schedule.workouts,
    });
    setEditDialogOpen(true);
  };

  const addScheduledWorkout = () => {
    const newScheduledWorkout: ScheduledWorkout = {
      workoutId: "",
      dayOfWeek: 0,
      time: "09:00",
      isCompleted: false,
    };
    setScheduleForm((prev) => ({
      ...prev,
      workouts: [...prev.workouts, newScheduledWorkout],
    }));
  };

  const updateScheduledWorkout = (
    index: number,
    field: keyof ScheduledWorkout,
    value: any
  ) => {
    setScheduleForm((prev) => ({
      ...prev,
      workouts: prev.workouts.map((workout, i) =>
        i === index ? { ...workout, [field]: value } : workout
      ),
    }));
  };

  const removeScheduledWorkout = (index: number) => {
    setScheduleForm((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitSchedule = () => {
    if (selectedSchedule) {
      handleUpdateSchedule({
        ...selectedSchedule,
        name: scheduleForm.name,
        startDate: new Date(scheduleForm.startDate),
        endDate: scheduleForm.endDate
          ? new Date(scheduleForm.endDate)
          : undefined,
        workouts: scheduleForm.workouts,
      });
    } else {
      handleCreateSchedule({
        userId: "current-user", // This would come from auth context
        name: scheduleForm.name,
        startDate: new Date(scheduleForm.startDate),
        endDate: scheduleForm.endDate
          ? new Date(scheduleForm.endDate)
          : undefined,
        workouts: scheduleForm.workouts,
        isActive: true,
      });
    }
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedSchedule(null);
  };

  const getWorkoutName = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    return workout ? workout.name : "Unknown Workout";
  };

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
          Workout Schedules
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateDialog}
        >
          Create Schedule
        </Button>
      </Box>

      {schedules.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CalendarToday
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No schedules yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create your first workout schedule to stay consistent!
            </Typography>
            <Button variant="contained" onClick={openCreateDialog}>
              Create Schedule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {schedules.map((schedule) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={schedule.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="h2">
                      {schedule.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {schedule.startDate.toLocaleDateString()} -{" "}
                    {schedule.endDate?.toLocaleDateString() || "Ongoing"}
                  </Typography>

                  <Chip
                    label={schedule.isActive ? "Active" : "Inactive"}
                    color={schedule.isActive ? "success" : "default"}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="subtitle2" gutterBottom>
                    Scheduled Workouts:
                  </Typography>
                  <List dense>
                    {schedule.workouts.map((scheduledWorkout, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={getWorkoutName(scheduledWorkout.workoutId)}
                          secondary={`${
                            daysOfWeek[scheduledWorkout.dayOfWeek]
                          } ${scheduledWorkout.time}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={
                              scheduledWorkout.isCompleted ? "Done" : "Pending"
                            }
                            color={
                              scheduledWorkout.isCompleted
                                ? "success"
                                : "default"
                            }
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Schedule Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSchedule ? "Edit Schedule" : "Create New Schedule"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Schedule Name"
                  value={scheduleForm.name}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={scheduleForm.startDate}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="End Date (Optional)"
                  type="date"
                  value={scheduleForm.endDate}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Scheduled Workouts</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addScheduledWorkout}
                >
                  Add Workout
                </Button>
              </Box>

              {scheduleForm.workouts.map((scheduledWorkout, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel>Workout</InputLabel>
                          <Select
                            value={scheduledWorkout.workoutId}
                            onChange={(e) =>
                              updateScheduledWorkout(
                                index,
                                "workoutId",
                                e.target.value
                              )
                            }
                          >
                            {workouts.map((workout) => (
                              <MenuItem key={workout.id} value={workout.id}>
                                {workout.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Day</InputLabel>
                          <Select
                            value={scheduledWorkout.dayOfWeek}
                            onChange={(e) =>
                              updateScheduledWorkout(
                                index,
                                "dayOfWeek",
                                parseInt(String(e.target.value))
                              )
                            }
                          >
                            {daysOfWeek.map((day, dayIndex) => (
                              <MenuItem key={dayIndex} value={dayIndex}>
                                {day}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          label="Time"
                          type="time"
                          value={scheduledWorkout.time}
                          onChange={(e) =>
                            updateScheduledWorkout(
                              index,
                              "time",
                              e.target.value
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <IconButton
                            color="error"
                            onClick={() => removeScheduledWorkout(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
              setEditDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitSchedule}
            variant="contained"
            disabled={
              !scheduleForm.name.trim() || scheduleForm.workouts.length === 0
            }
          >
            {selectedSchedule ? "Update" : "Create"} Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutSchedule;
