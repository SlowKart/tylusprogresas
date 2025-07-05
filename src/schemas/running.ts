import { z } from "zod";
import { 
  MIN_FINISH_TIME_SECONDS, 
  MAX_FINISH_TIME_SECONDS 
} from "@/constants/time";
import { 
  MIN_TRAINING_FREQUENCY, 
  MAX_TRAINING_FREQUENCY,
  MIN_PROGRAM_WEEKS,
  MAX_PROGRAM_WEEKS
} from "@/constants/training";

/**
 * Zod schemas for running form validation
 */

export const ExperienceLevelSchema = z.enum(["beginner", "intermediate", "advanced"], {
  errorMap: () => ({ message: "Please select a valid experience level" })
});

export const DistanceValueSchema = z.enum(["5km", "10km", "21km", "42km", "none"], {
  errorMap: () => ({ message: "Please select a valid distance" })
});

export const FrequencySchema = z.number()
  .min(MIN_TRAINING_FREQUENCY, `Training frequency must be at least ${MIN_TRAINING_FREQUENCY} days per week`)
  .max(MAX_TRAINING_FREQUENCY, `Training frequency cannot exceed ${MAX_TRAINING_FREQUENCY} days per week`)
  .int("Training frequency must be a whole number");

export const FinishTimeSchema = z.number()
  .min(MIN_FINISH_TIME_SECONDS, `Finish time must be at least ${MIN_FINISH_TIME_SECONDS / 60} minutes`)
  .max(MAX_FINISH_TIME_SECONDS, `Finish time cannot exceed ${MAX_FINISH_TIME_SECONDS / 3600} hours`)
  .int("Finish time must be in whole seconds");

export const GoalWeeksSchema = z.number()
  .min(MIN_PROGRAM_WEEKS, `Training program must be at least ${MIN_PROGRAM_WEEKS} weeks`)
  .max(MAX_PROGRAM_WEEKS, `Training program cannot exceed ${MAX_PROGRAM_WEEKS} weeks`)
  .int("Training weeks must be a whole number");

/**
 * Complete running form data schema
 */
export const RunningFormDataSchema = z.object({
  level: ExperienceLevelSchema,
  frequency: FrequencySchema,
  selected: DistanceValueSchema,
  finishTime: FinishTimeSchema,
  goalWeeks: GoalWeeksSchema
});

/**
 * Schema for basic step validation
 */
export const BasicStepSchema = z.object({
  level: ExperienceLevelSchema,
  frequency: FrequencySchema,
  selected: DistanceValueSchema
});

/**
 * Schema for goals step validation
 */
export const GoalsStepSchema = z.object({
  finishTime: FinishTimeSchema,
  goalWeeks: GoalWeeksSchema
});

/**
 * Schema for user selections
 */
export const RunningUserSelectionsSchema = z.object({
  sportType: z.literal("running"),
  level: ExperienceLevelSchema,
  frequency: FrequencySchema,
  distance: DistanceValueSchema,
  finishTime: FinishTimeSchema,
  goalWeeks: GoalWeeksSchema
});

/**
 * Type inference from schemas
 */
export type RunningFormDataValidated = z.infer<typeof RunningFormDataSchema>;
export type BasicStepValidated = z.infer<typeof BasicStepSchema>;
export type GoalsStepValidated = z.infer<typeof GoalsStepSchema>;
export type RunningUserSelectionsValidated = z.infer<typeof RunningUserSelectionsSchema>;

/**
 * Validation result type
 */
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: Record<string, string>;
};

/**
 * Validation helper functions
 */
export const validateRunningFormData = (data: unknown): ValidationResult<RunningFormDataValidated> => {
  const result = RunningFormDataSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }
};

export const validateBasicStep = (data: unknown): ValidationResult<BasicStepValidated> => {
  const result = BasicStepSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }
};

export const validateGoalsStep = (data: unknown): ValidationResult<GoalsStepValidated> => {
  const result = GoalsStepSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }
};

export const validateRunningUserSelections = (data: unknown): ValidationResult<RunningUserSelectionsValidated> => {
  const result = RunningUserSelectionsSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }
};