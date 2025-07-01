import React from "react";
import { StepLayout } from "@/components/StepLayout";
import { DISTANCES } from "@/constants/running";
import { formatTime, formatWeeks } from "@/utils/running";

export function SummaryStep({
  selected,
  finishTime,
  goalWeeks,
  calculatedPace,
  randomWorkout,
  onBack,
}: {
  selected: string;
  finishTime: number | null;
  goalWeeks: number;
  calculatedPace: string | null;
  randomWorkout: string | null;
  onBack: () => void;
}) {
  if (selected === "none") {
    return (
      <StepLayout title="Random Workout" onBack={onBack}>
        <div className="bg-background shadow-md rounded-xl p-8 max-w-card w-full flex flex-col items-center">
          <div className="mb-4 text-primary text-center">
            <span className="block text-xl font-bold mb-2">Your workout:</span>
            <div className="mt-2 text-base text-foreground font-medium">
              {randomWorkout}
            </div>
          </div>
          <p className="text-base text-foreground text-center leading-relaxed">
            This is a randomly generated workout. Enjoy your run!
          </p>
        </div>
      </StepLayout>
    );
  }
  return (
    <StepLayout title="Your Running Goal" onBack={onBack}>
      <div className="w-full max-w-card flex flex-col items-center p-0 gap-4">
        <div className="mb-4 text-primary w-full">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-center">Goal Summary</span>
            <span className="text-base text-foreground text-center">
              <span className="font-semibold">Distance:</span>{" "}
              {DISTANCES.find((d) => d.value === selected)?.label}
            </span>
            {selected !== "none" && finishTime !== null && (
              <>
                <span className="text-base text-foreground text-center">
                  <span className="font-semibold">Finish time:</span>{" "}
                  {finishTime !== null ? formatTime(finishTime) : "-"}
                </span>
                <span className="text-base text-foreground text-center">
                  <span className="font-semibold">Pace:</span> {calculatedPace}
                </span>
              </>
            )}
            <span className="text-base text-foreground text-center">
              <span className="font-semibold">Time to achieve:</span>{" "}
              {formatWeeks(goalWeeks)}
            </span>
          </div>
        </div>
        <p className="text-base text-foreground text-center leading-relaxed">
          To reach your goal, follow a structured training plan, gradually
          increase your weekly mileage, and include a mix of easy runs,
          intervals, and long runs. Remember to rest and listen to your body.
          Good luck!
        </p>
      </div>
    </StepLayout>
  );
}
