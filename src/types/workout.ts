export interface Workout {
    id: string;
    name: string;
    description?: string;
    duration: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'cardio' | 'strength' | 'flexibility' | 'mixed';
    exercises: Exercise[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Exercise {
    id: string;
    name: string;
    sets?: number;
    reps?: number;
    duration?: number; // in seconds
    weight?: number; // in kg
    restTime?: number; // in seconds
    notes?: string;
}

export interface WorkoutSession {
    id: string;
    workoutId: string;
    userId: string;
    date: Date;
    duration: number; // actual duration in minutes
    completed: boolean;
    notes?: string;
    exercises: ExerciseSession[];
}

export interface ExerciseSession {
    exerciseId: string;
    sets: number;
    reps: number[];
    weights: number[];
    duration?: number;
    restTime?: number;
    notes?: string;
}

export interface WorkoutSchedule {
    id: string;
    userId: string;
    name: string;
    workouts: ScheduledWorkout[];
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
}

export interface ScheduledWorkout {
    workoutId: string;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    time?: string; // HH:MM format
    isCompleted: boolean;
}
