import React, { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepLayout } from "@/components/StepLayout";
import { DISTANCES, ExperienceLevel, DistanceValue } from "@/constants/running";
import { StepComponentProps } from "@/types/running";

/**
 * Basic information step for running form
 * Handles experience level and distance selection
 * Memoized to prevent unnecessary re-renders
 */
export const BasicsStep = memo(function BasicsStep({ formData, onUpdate, onNext, onBack }: StepComponentProps) {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  }, [onNext]);

  // Memoize experience level change handler
  const handleExperienceChange = useCallback((value: string) => {
    onUpdate({ level: value as ExperienceLevel });
  }, [onUpdate]);

  // Memoize distance change handler
  const handleDistanceChange = useCallback((value: string) => {
    onUpdate({ selected: value as DistanceValue });
  }, [onUpdate]);

  // Memoize button text to avoid recalculation
  const buttonText = useMemo(() => {
    return formData.selected === "none" ? "Get My Workout" : "Continue";
  }, [formData.selected]);

  return (
    <StepLayout title="Basic Information" onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full p-0">
        
        {/* Experience Level */}
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-lg font-semibold text-primary">
            Experience Level
          </Label>
          <Select 
            value={formData.level} 
            onValueChange={handleExperienceChange}
          >
            <SelectTrigger id="experience">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Distance Selection */}
        <div className="space-y-2">
          <Label htmlFor="distance" className="text-lg font-semibold text-primary">
            Target Distance
          </Label>
          <Select 
            value={formData.selected} 
            onValueChange={handleDistanceChange}
          >
            <SelectTrigger id="distance">
              <SelectValue placeholder="Select your target distance" />
            </SelectTrigger>
            <SelectContent>
              {DISTANCES.map((distance) => (
                <SelectItem key={distance.value} value={distance.value}>
                  {distance.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full mt-4">
          {buttonText}
        </Button>
      </form>
    </StepLayout>
  );
});