import { SimpleProgram } from './simpleProgram';

// Authentication and user types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface UserProgram {
  id: string;
  userId: string;
  sportType: 'bodybuilding' | 'general-fitness' | 'running';
  programName: string;
  programData: SimpleProgram | Record<string, unknown>; // SimpleProgram or RunningGoal data
  userSelections: UserSelections;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSelections {
  // Common selections
  sportType: 'bodybuilding' | 'general-fitness' | 'running';
  
  // Bodybuilding & General Fitness
  daysPerWeek?: number;
  equipment?: string[];
  
  // General Fitness specific
  cardioType?: string;
  
  // Running specific
  level?: string;
  frequency?: number;
  distance?: string;
  finishTime?: number;
  goalWeeks?: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  programId: string;
  currentWeek: number;
  currentDay: number;
  completedDays: string[]; // Array of "week-day" strings
  startedAt: Date;
  lastWorkoutAt?: Date;
  status: 'active' | 'completed' | 'paused';
}

export interface WorkoutCompletion {
  id: string;
  userId: string;
  programId: string;
  weekNumber: number;
  dayNumber: number;
  completedAt: Date;
  durationMinutes?: number;
  difficultyRating?: number; // 1-5
  enjoymentRating?: number; // 1-5
  notes?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeProgram: UserProgram | null;
  progress: UserProgress | null;
}