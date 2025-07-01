// Running-related constants and types
export type DistanceValue =
  | "5km"
  | "10km"
  | "halfmarathon"
  | "marathon"
  | "none";

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
  { label: "No Specific Goal", value: "none", km: 0 },
];

export const FINISH_TIME_RANGES: Record<
  DistanceValue,
  { min: number; max: number }
> = {
  "5km": { min: 15 * 60, max: 60 * 60 },
  "10km": { min: 30 * 60, max: 120 * 60 },
  halfmarathon: { min: 60 * 60, max: 240 * 60 },
  marathon: { min: 120 * 60, max: 420 * 60 },
  none: { min: 0, max: 0 }, // Not used but required for type safety
};

export const MIN_WEEKS = 4;
export const MAX_WEEKS = 48;
