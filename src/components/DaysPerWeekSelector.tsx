/**
 * Reusable days per week selection component
 */
import React, { memo, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MIN_DAYS_PER_WEEK, MAX_DAYS_PER_WEEK, DAYS_STEP } from "@/constants/training";

interface DaysPerWeekSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
  title?: string;
  className?: string;
}

/**
 * Days per week selection component with slider
 * Memoized to prevent unnecessary re-renders
 */
export const DaysPerWeekSelector = memo(function DaysPerWeekSelector({
  value,
  onChange,
  title = "How many days per week do you want to exercise?",
  className = ""
}: DaysPerWeekSelectorProps) {
  // Memoize the display text to avoid recalculation on every render
  const displayText = useMemo(() => {
    const days = value[0];
    return `${days} ${days === 1 ? "day" : "days"} per week`;
  }, [value]);

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-lg font-medium">
        {title}
      </Label>
      <div className="space-y-2">
        <Slider
          value={value}
          onValueChange={onChange}
          max={MAX_DAYS_PER_WEEK}
          min={MIN_DAYS_PER_WEEK}
          step={DAYS_STEP}
          className="w-full"
        />
        <div className="text-center text-2xl font-bold text-primary">
          {displayText}
        </div>
      </div>
    </div>
  );
});