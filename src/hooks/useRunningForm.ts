import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";
import { 
  FINISH_TIME_RANGES, 
  MIN_WEEKS, 
  MAX_WEEKS
} from "@/constants/running";
import { DEFAULT_FINISH_TIME_SECONDS } from "@/constants/time";
import { WEEKS_PER_MONTH, WEEK_SNAPPING_THRESHOLD, MIN_MONTH_WEEKS } from "@/constants/training";
import { 
  RunningFormData, 
  RunningFormStep, 
  RunningUserSelections,
  RandomWorkoutProgram,
  GoalProgram
} from "@/types/running";
import { handleError, FormErrorHandler } from "@/utils/errorHandling";
import { useValidation } from "@/hooks/useValidation";
import { 
  RunningFormDataSchema,
  validateBasicStep,
  validateGoalsStep,
  validateRunningUserSelections
} from "@/schemas/running";

/**
 * Custom hook for managing running form state and business logic
 */
export function useRunningForm() {
  const router = useRouter();
  const { user, isAuthenticated, refreshActiveProgram } = useAuth();
  const { validate, errors: validationErrors, isValid, clearErrors: clearValidationErrors } = useValidation();
  
  const [step, setStep] = useState<RunningFormStep>("basics");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RunningFormData>({
    level: "beginner",
    frequency: 3,
    selected: "5km",
    finishTime: DEFAULT_FINISH_TIME_SECONDS,
    goalWeeks: MIN_WEEKS
  });

  // Update finish time when distance changes
  useEffect(() => {
    if (formData.selected && formData.selected !== "none") {
      const { min, max } = FINISH_TIME_RANGES[formData.selected] || {};
      setFormData(prev => ({
        ...prev,
        finishTime: Math.floor((min + max) / 2)
      }));
    }
  }, [formData.selected]);

  /**
   * Update form data with partial updates
   */
  const updateFormData = useCallback((updates: Partial<RunningFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Snap weeks to whole months above threshold
   */
  const updateGoalWeeks = useCallback((value: number) => {
    let adjustedValue = value;
    if (adjustedValue > WEEK_SNAPPING_THRESHOLD) {
      adjustedValue = Math.round(adjustedValue / WEEKS_PER_MONTH) * WEEKS_PER_MONTH;
      if (adjustedValue > MAX_WEEKS) adjustedValue = MAX_WEEKS;
      if (adjustedValue < MIN_MONTH_WEEKS) adjustedValue = MIN_MONTH_WEEKS;
    }
    updateFormData({ goalWeeks: adjustedValue });
  }, [updateFormData]);

  /**
   * Handle step navigation with validation
   */
  const goToNextStep = useCallback(() => {
    clearValidationErrors();
    
    if (step === "basics") {
      // Validate basic step data
      const basicData = {
        level: formData.level,
        frequency: formData.frequency,
        selected: formData.selected
      };
      
      const validationResult = validateBasicStep(basicData);
      if (!validationResult.success) {
        setError("Please fix the validation errors before continuing");
        return;
      }
      
      setStep(formData.selected === "none" ? "summary" : "goals");
    } else if (step === "goals") {
      // Validate goals step data
      const goalsData = {
        finishTime: formData.finishTime,
        goalWeeks: formData.goalWeeks
      };
      
      const validationResult = validateGoalsStep(goalsData);
      if (!validationResult.success) {
        setError("Please fix the validation errors before continuing");
        return;
      }
      
      setStep("summary");
    }
  }, [step, formData, clearValidationErrors]);

  const goToPreviousStep = useCallback(() => {
    if (step === "goals") {
      setStep("basics");
    } else if (step === "summary") {
      setStep(formData.selected === "none" ? "basics" : "goals");
    }
  }, [step, formData.selected]);

  /**
   * Save program for authenticated users
   */
  const saveProgram = useCallback(async (programData: RandomWorkoutProgram | GoalProgram) => {
    if (!isAuthenticated || !user) {
      setError("User not authenticated");
      return;
    }

    // Validate complete form data before saving
    const validationResult = validate(formData, RunningFormDataSchema);
    if (!validationResult.success) {
      setError("Please fix validation errors before saving");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const userSelections: RunningUserSelections = {
        sportType: 'running',
        level: formData.level,
        frequency: formData.frequency,
        distance: formData.selected,
        finishTime: formData.finishTime,
        goalWeeks: formData.goalWeeks
      };

      // Validate user selections
      const userSelectionsValidation = validateRunningUserSelections(userSelections);
      if (!userSelectionsValidation.success) {
        setError("Invalid form data. Please review your selections.");
        return;
      }

      await authService.saveProgram(user.id, 'running', userSelections, programData);
      await refreshActiveProgram();
      router.push("/dashboard");
    } catch (error) {
      const formError = FormErrorHandler.handleFormError(error, "Failed to save program");
      setError(formError.message);
      handleError(error as Error, "Running form save program");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, formData, validate, refreshActiveProgram, router]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    step,
    formData,
    isLoading,
    error,
    validationErrors,
    isValid,
    isAuthenticated,
    user,
    updateFormData,
    updateGoalWeeks,
    goToNextStep,
    goToPreviousStep,
    setStep,
    saveProgram,
    clearError,
    clearValidationErrors
  }), [
    step,
    formData,
    isLoading,
    error,
    validationErrors,
    isValid,
    isAuthenticated,
    user,
    updateFormData,
    updateGoalWeeks,
    goToNextStep,
    goToPreviousStep,
    setStep,
    saveProgram,
    clearError,
    clearValidationErrors
  ]);
}