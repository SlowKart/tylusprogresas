import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StepLayout } from "@/components/StepLayout";
import { FINISH_TIME_RANGES } from "@/constants/running";
import { formatTime } from "@/utils/running";
import { StepComponentProps } from "@/types/running";

interface GoalsStepProps extends StepComponentProps {
  onUpdateGoalWeeks: (value: number) => void;
}

/**
 * Training goals step for running form
 * Handles frequency, finish time, and goal weeks
 */
export function GoalsStep({ 
  formData, 
  onUpdate, 
  onNext, 
  onBack, 
  onUpdateGoalWeeks 
}: GoalsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <StepLayout title="Training Goals" onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full p-0">
        
        {/* Training Frequency */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-primary">
            Training Frequency
          </Label>
          <div className="space-y-2">
            <Slider
              value={[formData.frequency]}
              min={2}
              max={7}
              step={1}
              onValueChange={([val]) => onUpdate({ frequency: val })}
              className="w-full"
            />
            <div className="text-center">
              <span className="font-medium text-primary text-base">
                {formData.frequency}x / week
              </span>
            </div>
          </div>
        </div>

        {/* Target Finish Time - only show if not "none" distance */}
        {formData.selected !== "none" && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-primary">
              Target Finish Time
            </Label>
            <div className="space-y-2">
              <Slider
                value={[formData.finishTime]}
                min={FINISH_TIME_RANGES[formData.selected].min}
                max={FINISH_TIME_RANGES[formData.selected].max}
                step={60}
                onValueChange={([val]) => onUpdate({ finishTime: val })}
                className="w-full"
              />
              <div className="text-center">
                <span className="font-medium text-primary text-base">
                  {formatTime(formData.finishTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Training Duration */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-primary">
            Time to Achieve Goal
          </Label>
          <div className="space-y-2">
            <Slider
              value={[formData.goalWeeks]}
              min={8}
              max={52}
              step={1}
              onValueChange={([val]) => onUpdateGoalWeeks(val)}
              className="w-full"
            />
            <div className="text-center">
              <span className="font-medium text-primary text-base">
                {formData.goalWeeks <= 12 
                  ? `${formData.goalWeeks} weeks`
                  : `${Math.round(formData.goalWeeks / 4)} months`
                }
              </span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          Create My Running Plan
        </Button>
      </form>
    </StepLayout>
  );
}