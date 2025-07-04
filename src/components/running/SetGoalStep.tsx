import React from "react";
import { StepLayout } from "@/components/StepLayout";
import { GoalSlider } from "@/components/GoalSlider";
import {
  FINISH_TIME_RANGES,
  MIN_WEEKS,
  MAX_WEEKS,
  DistanceValue,
} from "@/constants/running";
import { Button } from "@/components/ui/button";
import { formatTime, formatWeeks } from "@/utils/running";

export function SetGoalStep({
  selected,
  finishTime,
  goalWeeks,
  onFinishTimeChange,
  onGoalWeeksChange,
  onContinue,
  onBack,
}: {
  selected: DistanceValue;
  finishTime: number;
  goalWeeks: number;
  onFinishTimeChange: (v: number) => void;
  onGoalWeeksChange: (v: number) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <StepLayout title="Set Your Goal" onBack={onBack}>
      <form
        className="flex flex-col gap-form w-full p-0"
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        {selected !== "none" && finishTime !== null && (
          <GoalSlider
            label="Select your target finish time:"
            value={finishTime}
            onChange={onFinishTimeChange}
            min={FINISH_TIME_RANGES[selected].min}
            max={FINISH_TIME_RANGES[selected].max}
            step={60}
            formatValue={formatTime}
          />
        )}
        <GoalSlider
          label="Time to achieve this goal:"
          value={goalWeeks}
          onChange={onGoalWeeksChange}
          min={MIN_WEEKS}
          max={MAX_WEEKS}
          formatValue={formatWeeks}
        />
        <Button
          type="submit"
          className="w-full mt-form-btn"
          disabled={selected !== "none" && finishTime === null}
        >
          Continue
        </Button>
      </form>
    </StepLayout>
  );
}
