import React, { createContext, useContext, useState, ReactNode } from "react";
import { Workout, WorkoutSchedule, WorkoutSession } from "../types/workout";
import { mockDataService } from "../services/mockDataService";

interface WorkoutContextType {
  workouts: Workout[];
  schedules: WorkoutSchedule[];
  sessions: WorkoutSession[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<WorkoutSchedule[]>>;
  setSessions: React.Dispatch<React.SetStateAction<WorkoutSession[]>>;
  handleCreateWorkout: (
    workoutData: Omit<Workout, "id" | "createdAt" | "updatedAt">
  ) => void;
  handleEditWorkout: (
    workoutId: string,
    workoutData: Omit<Workout, "id" | "createdAt" | "updatedAt">
  ) => void;
  handleDeleteWorkout: (workoutId: string) => void;
  handleCreateSchedule: (scheduleData: Omit<WorkoutSchedule, "id">) => void;
  handleUpdateSchedule: (schedule: WorkoutSchedule) => void;
  handleDeleteSchedule: (scheduleId: string) => void;
  handleStartWorkout: (workoutId: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({
  children,
}) => {
  const [workouts, setWorkouts] = useState<Workout[]>(mockDataService.workouts);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>(
    mockDataService.schedules
  );
  const [sessions, setSessions] = useState<WorkoutSession[]>(
    mockDataService.sessions
  );

  const handleCreateWorkout = (
    workoutData: Omit<Workout, "id" | "createdAt" | "updatedAt">
  ) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkouts((prev) => [...prev, newWorkout]);
  };

  const handleEditWorkout = (
    workoutId: string,
    workoutData: Omit<Workout, "id" | "createdAt" | "updatedAt">
  ) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId ? { ...w, ...workoutData, updatedAt: new Date() } : w
      )
    );
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  const handleCreateSchedule = (scheduleData: Omit<WorkoutSchedule, "id">) => {
    const newSchedule: WorkoutSchedule = {
      ...scheduleData,
      id: Date.now().toString(),
    };
    setSchedules((prev) => [...prev, newSchedule]);
  };

  const handleUpdateSchedule = (schedule: WorkoutSchedule) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === schedule.id ? schedule : s))
    );
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  const handleStartWorkout = (workoutId: string) => {
    // In a real app, this would navigate to a workout session page
    console.log("Starting workout:", workoutId);
    alert("Workout session would start here!");
  };

  const value: WorkoutContextType = {
    workouts,
    schedules,
    sessions,
    setWorkouts,
    setSchedules,
    setSessions,
    handleCreateWorkout,
    handleEditWorkout,
    handleDeleteWorkout,
    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,
    handleStartWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
