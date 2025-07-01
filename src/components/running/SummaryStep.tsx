import React from "react";
import { StepLayout } from "../StepLayout";
import { DISTANCES } from "../../constants/running";
import { formatTime } from "../../utils/running";

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
        <div className="bg-white shadow-md rounded-xl p-8 max-w-[393px] w-full flex flex-col items-center">
          <div className="mb-4 text-[#494A50] text-center">
            <b>Your workout:</b>
            <div className="mt-2 text-[#1F2024]">{randomWorkout}</div>
          </div>
          <p className="text-[#71727A] text-center mb-2">
            This is a randomly generated workout. Enjoy your run!
          </p>
        </div>
      </StepLayout>
    );
  }
  return (
    <StepLayout title="Your Running Goal" onBack={onBack}>
      <div className="bg-white shadow-md rounded-xl p-8 max-w-[393px] w-full flex flex-col items-center">
        <div className="mb-4 text-[#494A50]">
          <div>
            <b>Distance:</b>{" "}
            {DISTANCES.find((d) => d.value === selected)?.label}
          </div>
          {selected !== "none" && finishTime !== null && (
            <>
              <div>
                <b>Finish time:</b>{" "}
                {finishTime !== null ? formatTime(finishTime) : "-"}
              </div>
              <div>
                <b>Pace:</b> {calculatedPace}
              </div>
            </>
          )}
          <div>
            <b>Time to achieve:</b> {goalWeeks}
          </div>
        </div>
        <p className="text-[#71727A] text-center mb-2">
          To reach your goal, follow a structured training plan, gradually
          increase your weekly mileage, and include a mix of easy runs,
          intervals, and long runs. Remember to rest and listen to your body.
          Good luck!
        </p>
      </div>
    </StepLayout>
  );
}
