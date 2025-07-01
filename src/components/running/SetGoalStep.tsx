import React from "react";
import { StepLayout } from "../StepLayout";
import { GoalSlider } from "../GoalSlider";
import {
  FINISH_TIME_RANGES,
  MIN_WEEKS,
  MAX_WEEKS,
} from "../../constants/running";
import { Button } from "../Button";
import { formatTime, formatWeeks } from "../../utils/running";

export function SetGoalStep({
  selected,
  finishTime,
  goalWeeks,
  onFinishTimeChange,
  onGoalWeeksChange,
  onContinue,
  onBack,
}: {
  selected: string;
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
        className="flex flex-col gap-6 w-full max-w-[393px] p-0"
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
          variant="primary"
          className="w-full mt-4"
          disabled={selected !== "none" && finishTime === null}
        >
          Continue
        </Button>
      </form>
    </StepLayout>
  );
}
