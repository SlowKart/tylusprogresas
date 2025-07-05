import { DistanceValue, ExperienceLevel } from "@/constants/running";

/**
 * Running form data structure
 */
export interface RunningFormData {
  level: ExperienceLevel;
  frequency: number;
  selected: DistanceValue;
  finishTime: number;
  goalWeeks: number;
}

/**
 * Running form step types
 */
export type RunningFormStep = "basics" | "goals" | "summary";

/**
 * Props for step components
 */
export interface StepComponentProps {
  formData: RunningFormData;
  onUpdate: (updates: Partial<RunningFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * User selections for saving to auth service
 */
export interface RunningUserSelections {
  sportType: 'running';
  level: ExperienceLevel;
  frequency: number;
  distance: DistanceValue;
  finishTime: number;
  goalWeeks: number;
}

/**
 * Random workout program data
 */
export interface RandomWorkoutProgram extends Record<string, unknown> {
  workout: string;
  selections: RunningUserSelections;
}

/**
 * Goal-based program data
 */
export interface GoalProgram extends Record<string, unknown> {
  goal: {
    distance: string | undefined;
    finishTime: string;
    pace: string | null;
    weeks: string;
    level: ExperienceLevel;
    frequency: number;
  };
  selections: RunningUserSelections;
}