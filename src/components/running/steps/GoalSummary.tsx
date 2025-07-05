import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppContainer } from "@/components/AppContainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { DISTANCES } from "@/constants/running";
import { formatTime, formatWeeks, formatPace } from "@/utils/running";
import { StepComponentProps, GoalProgram } from "@/types/running";

interface GoalSummaryProps extends StepComponentProps {
  onSaveProgram: (programData: GoalProgram) => Promise<void>;
}

/**
 * Summary step for goal-based training (when distance is not "none")
 * Shows goal details and training plan
 */
export function GoalSummary({ 
  formData, 
  onBack, 
  onSaveProgram, 
  isLoading 
}: GoalSummaryProps) {
  // Calculate pace for summary
  let calculatedPace: string | null = null;
  if (formData.selected && formData.selected !== "none" && formData.finishTime !== null) {
    const dist = DISTANCES.find((d) => d.value === formData.selected)?.km;
    if (dist && dist > 0) {
      const paceSec = formData.finishTime / dist;
      calculatedPace = formatPace(paceSec) + " min/km";
    }
  }

  const handleSaveProgram = async () => {
    const programData = {
      goal: {
        distance: DISTANCES.find((d) => d.value === formData.selected)?.label,
        finishTime: formatTime(formData.finishTime),
        pace: calculatedPace,
        weeks: formatWeeks(formData.goalWeeks),
        level: formData.level,
        frequency: formData.frequency
      },
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
        <h1 className="text-3xl font-bold mb-8 text-primary">Your Running Goal</h1>
        
        <div className="flex flex-col gap-8 w-full max-w-card">
          {/* Goal Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Goal Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Distance:</span>
                <Badge variant="outline">
                  {DISTANCES.find((d) => d.value === formData.selected)?.label}
                </Badge>
              </div>
              
              {formData.finishTime !== null && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Finish time:</span>
                    <span className="text-muted-foreground">{formatTime(formData.finishTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pace:</span>
                    <span className="text-muted-foreground">{calculatedPace}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between">
                <span className="font-medium">Time to achieve:</span>
                <span className="text-muted-foreground">{formatWeeks(formData.goalWeeks)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Experience level:</span>
                <Badge variant="secondary">
                  {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Training frequency:</span>
                <span className="text-muted-foreground">{formData.frequency}x / week</span>
              </div>
            </CardContent>
          </Card>

          {/* Training Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To reach your goal, follow a structured training plan, gradually
                increase your weekly mileage, and include a mix of easy runs,
                intervals, and long runs. Remember to rest and listen to your body.
                Good luck!
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={handleSaveProgram}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Running Plan"}
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