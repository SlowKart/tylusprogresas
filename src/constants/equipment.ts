/**
 * Equipment-related constants for fitness programs
 */

export interface EquipmentOption {
  id: string;
  label: string;
}

export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  { id: "dumbbells", label: "Dumbbells" },
  { id: "barbell", label: "Barbell" },
  { id: "gym-machines", label: "Gym Machines" },
  { id: "no-equipment", label: "No Equipment" },
];

export const CARDIO_OPTIONS: EquipmentOption[] = [
  { id: "running", label: "Running" },
  { id: "cycling", label: "Cycling" },
];