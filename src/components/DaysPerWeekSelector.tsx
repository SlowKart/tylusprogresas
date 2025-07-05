/**
 * Reusable days per week selection component
 */
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface DaysPerWeekSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
  title?: string;
  className?: string;
}

/**
 * Days per week selection component with slider
 */
export function DaysPerWeekSelector({
  value,
  onChange,
  title = "How many days per week do you want to exercise?",
  className = ""
}: DaysPerWeekSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-lg font-medium">
        {title}
      </Label>
      <div className="space-y-2">
        <Slider
          value={value}
          onValueChange={onChange}
          max={7}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="text-center text-2xl font-bold text-primary">
          {value[0]} {value[0] === 1 ? "day" : "days"} per week
        </div>
      </div>
    </div>
  );
}