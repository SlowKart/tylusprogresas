// Program data structures for fitness programs parsed from PDFs

import { ExperienceLevel } from "../constants/running";

// Base program types
export type ProgramType = 'running' | 'strength' | 'mixed' | 'cardio' | 'flexibility';
export type IntensityType = 'rpe' | 'percentage' | 'pace' | 'descriptive';
export type WorkoutType = 'speed' | 'long' | 'recovery' | 'strength' | 'power' | 'conditioning' | 'core' | 'rest';

// Intensity specifications
export interface IntensitySpec {
  type: IntensityType;
  value: number | string;
  unit?: string; // e.g., "5K pace", "RPE", "%"
  description?: string;
}

// Exercise details
export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number | string; // Can be "AMRAP", "5-8", etc.
  weight?: number | string;
  duration?: number; // seconds
  distance?: number; // meters
  rest?: number; // seconds
  intensity?: IntensitySpec;
  notes?: string;
  modifications?: string[];
  equipment?: string[];
  order: number; // Position within workout
}

// Superset/circuit grouping
export interface ExerciseGroup {
  id: string;
  type: 'superset' | 'circuit' | 'sequence';
  exercises: Exercise[];
  rounds?: number;
  restBetweenRounds?: number; // seconds
  notes?: string;
}

// Individual workout session
export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  day: number; // 1-7 for day of week
  duration?: number; // minutes
  description?: string;
  warmup?: Exercise[];
  mainExercises: (Exercise | ExerciseGroup)[];
  cooldown?: Exercise[];
  notes?: string;
  intensity?: IntensitySpec;
  equipment?: string[];
}

// Weekly structure
export interface Week {
  id: string;
  number: number; // 1-based week number
  name?: string;
  phase?: string;
  focus?: string;
  workouts: Workout[];
  notes?: string;
  restDays: number[]; // Array of day numbers (1-7)
}

// Program phases (for multi-phase programs)
export interface Phase {
  id: string;
  number: number; // 1-based phase number
  name: string;
  focus: string;
  description?: string;
  startWeek: number;
  endWeek: number;
  weeks: Week[];
  notes?: string;
}

// Program metadata
export interface ProgramMetadata {
  name: string;
  description?: string;
  duration: number; // weeks
  difficulty: ExperienceLevel;
  type: ProgramType;
  author?: string;
  source?: string; // PDF filename
  goals?: string[];
  prerequisites?: string[];
  equipment?: string[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Complete program structure
export interface Program {
  id: string;
  metadata: ProgramMetadata;
  phases?: Phase[]; // For multi-phase programs
  weeks: Week[];
  totalWorkouts: number;
  estimatedTimePerWeek: number; // minutes
  notes?: string;
  version: string;
}

// Parsing-related types
export interface ParsedProgram {
  program: Program;
  confidence: number; // 0-100
  warnings: string[];
  errors: string[];
  parsingMetadata: {
    sourceFile: string;
    parsedAt: Date;
    parserVersion: string;
  };
}

// User program progress
export interface UserProgram {
  id: string;
  userId: string;
  programId: string;
  startDate: Date;
  currentWeek: number;
  currentDay: number;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  completedWorkouts: string[]; // Array of workout IDs
  notes?: string;
  modifications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Workout completion tracking
export interface WorkoutCompletion {
  id: string;
  userProgramId: string;
  workoutId: string;
  completedAt: Date;
  actualDuration?: number; // minutes
  exerciseCompletions: ExerciseCompletion[];
  notes?: string;
  difficulty?: number; // 1-10 scale
  enjoyment?: number; // 1-10 scale
}

// Exercise completion tracking
export interface ExerciseCompletion {
  id: string;
  exerciseId: string;
  completed: boolean;
  actualSets?: number;
  actualReps?: number;
  actualWeight?: number;
  actualDuration?: number;
  notes?: string;
  modifications?: string[];
}

// Program templates for different types
export interface ProgramTemplate {
  id: string;
  name: string;
  type: ProgramType;
  difficulty: ExperienceLevel;
  defaultDuration: number; // weeks
  weeklyStructure: {
    workoutsPerWeek: number;
    restDaysPerWeek: number;
    avgWorkoutDuration: number; // minutes
  };
  phases?: {
    name: string;
    focus: string;
    weeks: number;
  }[];
  equipment: string[];
  tags: string[];
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Export all types for easy importing
export type {
  ProgramType,
  IntensityType,
  WorkoutType,
  IntensitySpec,
  Exercise,
  ExerciseGroup,
  Workout,
  Week,
  Phase,
  ProgramMetadata,
  Program,
  ParsedProgram,
  UserProgram,
  WorkoutCompletion,
  ExerciseCompletion,
  ProgramTemplate,
  ValidationResult,
  ValidationError,
  ValidationWarning,
};