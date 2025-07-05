import { SECONDS_PER_MINUTE } from "./time";
import { MIN_PROGRAM_WEEKS, YEAR_IN_WEEKS } from "./training";

// Running-related constants and types
export type DistanceValue =
  | "5km"
  | "10km"
  | "halfmarathon"
  | "marathon"
  | "none";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface DistanceOption {
  label: string;
  value: DistanceValue;
  km: number;
}

export const DISTANCES: DistanceOption[] = [
  { label: "5 km", value: "5km", km: 5 },
  { label: "10 km", value: "10km", km: 10 },
  { label: "Half Marathon", value: "halfmarathon", km: 21.0975 },
  { label: "Marathon", value: "marathon", km: 42.195 },
  { label: "I just want to run", value: "none", km: 0 },
];

export const FINISH_TIME_RANGES: Record<
  DistanceValue,
  { min: number; max: number }
> = {
  "5km": { min: 15 * SECONDS_PER_MINUTE, max: 60 * SECONDS_PER_MINUTE },
  "10km": { min: 30 * SECONDS_PER_MINUTE, max: 120 * SECONDS_PER_MINUTE },
  halfmarathon: { min: 60 * SECONDS_PER_MINUTE, max: 240 * SECONDS_PER_MINUTE },
  marathon: { min: 120 * SECONDS_PER_MINUTE, max: 420 * SECONDS_PER_MINUTE },
  none: { min: 0, max: 0 }, // Not used but required for type safety
};

export const MIN_WEEKS = MIN_PROGRAM_WEEKS;
export const MAX_WEEKS = YEAR_IN_WEEKS;
