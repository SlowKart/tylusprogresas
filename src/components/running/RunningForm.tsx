import React, { useCallback, useMemo } from "react";
import { useRunningForm } from "@/hooks/useRunningForm";
import { BasicsStep } from "./steps/BasicsStep";
import { GoalsStep } from "./steps/GoalsStep";
import { RandomWorkoutSummary } from "./steps/RandomWorkoutSummary";
import { GoalSummary } from "./steps/GoalSummary";
import { FormErrorBoundary } from "@/components/FormErrorBoundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { ValidationErrors } from "@/components/ValidationErrors";

interface RunningFormProps {
  onBack: () => void;
}

/**
 * Multi-step running form orchestrator
 * Manages step navigation and delegates rendering to step components
 */
export function RunningForm({ onBack }: RunningFormProps) {
  const {
    step,
    formData,
    isLoading,
    error,
    validationErrors,
    updateFormData,
    updateGoalWeeks,
    goToNextStep,
    goToPreviousStep,
    setStep,
    saveProgram,
    clearError,
    clearValidationErrors
  } = useRunningForm();

  const handleRetry = useCallback(() => {
    // Clear error and reset to initial step
    clearError();
    setStep("basics");
  }, [clearError, setStep]);

  // Memoize the back handler for RandomWorkoutSummary to prevent recreation
  const handleRandomWorkoutBack = useCallback(() => setStep("basics"), [setStep]);

  // Memoize the step rendering to prevent unnecessary recalculations
  const renderStep = useMemo(() => {
    switch (step) {
      case "basics":
        return (
          <BasicsStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={goToNextStep}
            onBack={onBack}
          />
        );

      case "goals":
        return (
          <GoalsStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            onUpdateGoalWeeks={updateGoalWeeks}
          />
        );

      case "summary":
        // Show different summary based on selected distance
        if (formData.selected === "none") {
          return (
            <RandomWorkoutSummary
              formData={formData}
              onUpdate={updateFormData}
              onNext={goToNextStep}
              onBack={handleRandomWorkoutBack}
              onSaveProgram={saveProgram}
              isLoading={isLoading}
            />
          );
        } else {
          return (
            <GoalSummary
              formData={formData}
              onUpdate={updateFormData}
              onNext={goToNextStep}
              onBack={goToPreviousStep}
              onSaveProgram={saveProgram}
              isLoading={isLoading}
            />
          );
        }

      default:
        return null;
    }
  }, [
    step,
    formData,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    updateGoalWeeks,
    handleRandomWorkoutBack,
    saveProgram,
    isLoading,
    onBack
  ]);

  return (
    <FormErrorBoundary onRetry={handleRetry}>
      <div className="space-y-4">
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <CardTitle className="text-sm font-medium text-destructive ml-2">
                Error
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-auto p-0 h-4 w-4 text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-destructive">
                {error}
              </CardDescription>
            </CardContent>
          </Card>
        )}
        
        {/* Validation Errors */}
        <ValidationErrors 
          errors={validationErrors} 
          onClear={clearValidationErrors}
          title="Please fix these issues"
        />
        
        {renderStep}
      </div>
    </FormErrorBoundary>
  );
}