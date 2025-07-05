import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppContainer } from "@/components/AppContainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRandomWorkout } from "@/utils/running";
import { StepComponentProps, RandomWorkoutProgram } from "@/types/running";

interface RandomWorkoutSummaryProps extends StepComponentProps {
  onSaveProgram: (programData: RandomWorkoutProgram) => Promise<void>;
}

/**
 * Summary step for random workout (when distance is "none")
 * Shows generated workout and save option
 */
export function RandomWorkoutSummary({ 
  formData, 
  onBack, 
  onSaveProgram, 
  isLoading 
}: RandomWorkoutSummaryProps) {
  const randomWorkout = useRandomWorkout(formData.selected, formData.level);

  const handleSaveProgram = async () => {
    if (!randomWorkout) return; // Guard against null workout

    const programData: RandomWorkoutProgram = {
      workout: randomWorkout,
      selections: {
        sportType: 'running' as const,
        level: formData.level,
        frequency: formData.frequency,
        distance: formData.selected,
        finishTime: formData.finishTime,
        goalWeeks: formData.goalWeeks
      }
    };

    await onSaveProgram(programData);
  };

  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-8 text-primary">Random Workout</h1>
        
        <div className="flex flex-col gap-8 w-full max-w-card">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">Your workout:</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center font-medium mb-4">
                {randomWorkout || "Generating your workout..."}
              </p>
              <p className="text-sm text-muted-foreground text-center">
                This is a randomly generated workout based on your experience level. Enjoy your run!
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={handleSaveProgram}
              disabled={isLoading || !randomWorkout}
            >
              {isLoading ? "Saving..." : "Save Program"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}