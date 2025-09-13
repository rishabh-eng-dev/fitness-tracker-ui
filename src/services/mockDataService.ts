import { Workout, WorkoutSchedule, WorkoutSession } from "../types/workout";

export const mockDataService = {
    workouts: [
        {
            id: "1",
            name: "Morning Cardio Blast",
            description: "High-intensity cardio workout to start your day",
            duration: 30,
            difficulty: "intermediate" as const,
            category: "cardio" as const,
            exercises: [
                { id: "1", name: "Jumping Jacks", sets: 3, reps: 30, restTime: 30 },
                { id: "2", name: "Burpees", sets: 3, reps: 15, restTime: 45 },
                { id: "3", name: "Mountain Climbers", sets: 3, reps: 20, restTime: 30 },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "2",
            name: "Upper Body Strength",
            description: "Build upper body strength with these exercises",
            duration: 45,
            difficulty: "beginner" as const,
            category: "strength" as const,
            exercises: [
                { id: "4", name: "Push-ups", sets: 3, reps: 12, restTime: 60 },
                { id: "5", name: "Pull-ups", sets: 3, reps: 8, restTime: 90 },
                {
                    id: "6",
                    name: "Dumbbell Rows",
                    sets: 3,
                    reps: 10,
                    weight: 15,
                    restTime: 60,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "3",
            name: "Yoga Flow",
            description: "Relaxing yoga session for flexibility and mindfulness",
            duration: 60,
            difficulty: "beginner" as const,
            category: "flexibility" as const,
            exercises: [
                { id: "7", name: "Downward Dog", sets: 1, reps: 1, duration: 60 },
                { id: "8", name: "Warrior Pose", sets: 1, reps: 1, duration: 45 },
                { id: "9", name: "Tree Pose", sets: 1, reps: 1, duration: 30 },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "4",
            name: "HIIT Challenge",
            description: "High-intensity interval training for maximum results",
            duration: 25,
            difficulty: "advanced" as const,
            category: "mixed" as const,
            exercises: [
                {
                    id: "10",
                    name: "Sprint",
                    sets: 4,
                    reps: 1,
                    duration: 30,
                    restTime: 60,
                },
                { id: "11", name: "Jump Squats", sets: 4, reps: 15, restTime: 45 },
                {
                    id: "12",
                    name: "Plank",
                    sets: 4,
                    reps: 1,
                    duration: 45,
                    restTime: 30,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "5",
            name: "Core Crusher",
            description: "Target your core muscles with this intense workout",
            duration: 35,
            difficulty: "intermediate" as const,
            category: "strength" as const,
            exercises: [
                { id: "13", name: "Crunches", sets: 3, reps: 20, restTime: 30 },
                { id: "14", name: "Russian Twists", sets: 3, reps: 25, restTime: 30 },
                { id: "15", name: "Leg Raises", sets: 3, reps: 15, restTime: 45 },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ] as Workout[],

    schedules: [
        {
            id: "schedule-1",
            userId: "dummy-user-123",
            name: "Weekly Fitness Plan",
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            workouts: [
                { workoutId: "1", dayOfWeek: 1, time: "07:00", isCompleted: false }, // Monday - Cardio
                { workoutId: "2", dayOfWeek: 3, time: "18:00", isCompleted: false }, // Wednesday - Strength
                { workoutId: "3", dayOfWeek: 5, time: "19:00", isCompleted: false }, // Friday - Yoga
            ],
            isActive: true,
        },
        {
            id: "schedule-2",
            userId: "dummy-user-123",
            name: "Intense Training",
            startDate: new Date(),
            workouts: [
                { workoutId: "4", dayOfWeek: 2, time: "06:30", isCompleted: true }, // Tuesday - HIIT
                { workoutId: "5", dayOfWeek: 4, time: "17:30", isCompleted: false }, // Thursday - Core
                { workoutId: "1", dayOfWeek: 6, time: "08:00", isCompleted: false }, // Saturday - Cardio
            ],
            isActive: true,
        },
    ] as WorkoutSchedule[],

    sessions: [
        {
            id: "1",
            workoutId: "1",
            userId: "dummy-user-123",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            duration: 28,
            completed: true,
            exercises: [],
        },
        {
            id: "2",
            workoutId: "4",
            userId: "dummy-user-123",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            duration: 25,
            completed: true,
            exercises: [],
        },
        {
            id: "3",
            workoutId: "5",
            userId: "dummy-user-123",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            duration: 35,
            completed: true,
            exercises: [],
        },
        {
            id: "4",
            workoutId: "2",
            userId: "dummy-user-123",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            duration: 42,
            completed: true,
            exercises: [],
        },
        {
            id: "5",
            workoutId: "3",
            userId: "dummy-user-123",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            duration: 60,
            completed: true,
            exercises: [],
        },
    ] as WorkoutSession[],
};
