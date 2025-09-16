export interface UserProfileDetails {
    userId: number,
    personalDetails: PersonalDetails,

}

export interface PersonalDetails {
    weight: number,
    height: number,
    dateOfBirth: Date
}

export interface Goals {
    targetWeight: number,
    weeklyWorkoutFrequency: number,
    activeGoals: string[]
}

export interface Preferences {
    units: Unit
}

export interface Unit {
    weight: string,
    distance: string,
    length: string
}