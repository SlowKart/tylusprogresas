// Simplified program data structures for easy PDF parsing and app display

export type ProgramDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProgramType = 'running' | 'strength' | 'cardio' | 'flexibility' | 'mixed';

// Simple exercise structure
export interface Exercise {
  name: string;           // e.g., "Run", "Squats", "Plank"
  details: string;        // e.g., "20 minutes easy pace", "3 sets x 8 reps"
}

// Day structure
export interface Day {
  day: number;           // 1-7 (Monday-Sunday)
  name: string;          // e.g., "Easy Run", "Upper Body", "REST"
  exercises: Exercise[]; // Empty array for rest days
}

// Week structure  
export interface Week {
  number: number;        // 1, 2, 3, etc.
  days: Day[];          // Up to 7 days
}

// Program metadata
export interface ProgramMetadata {
  name: string;          // e.g., "Beginner 5K Training"
  duration: number;      // Number of weeks
  difficulty: ProgramDifficulty;
  type: ProgramType;
  equipment: string[];   // e.g., ["running shoes", "dumbbells"]
  description?: string;  // Optional brief description
}

// Complete simple program
export interface SimpleProgram {
  id: string;            // Unique identifier
  metadata: ProgramMetadata;
  weeks: Week[];
  createdAt?: Date;
  updatedAt?: Date;
}

// User progress tracking
export interface UserProgress {
  id: string;
  userId: string;
  programId: string;
  currentWeek: number;
  currentDay: number;
  completedDays: string[];  // Array of "week-day" strings like ["1-1", "1-3", "2-1"]
  startDate: Date;
  status: 'active' | 'completed' | 'paused';
}

// Day completion
export interface DayCompletion {
  id: string;
  userProgressId: string;
  week: number;
  day: number;
  completedAt: Date;
  notes?: string;
  difficulty?: number;    // 1-5 scale
  enjoyment?: number;     // 1-5 scale
}

// Parsed program from PDF
export interface ParsedProgram {
  program: SimpleProgram;
  parseErrors: string[];
  parseWarnings: string[];
  confidence: number;     // 0-100
}

// Program template for creating new programs
export interface ProgramTemplate {
  name: string;
  type: ProgramType;
  difficulty: ProgramDifficulty;
  weekCount: number;
  daysPerWeek: number;
  equipment: string[];
  sampleWeek: Week;
}

// Export types for easy importing
export type {
  ProgramDifficulty,
  ProgramType,
  Exercise,
  Day,
  Week,
  ProgramMetadata,
  SimpleProgram,
  UserProgress,
  DayCompletion,
  ParsedProgram,
  ProgramTemplate
};