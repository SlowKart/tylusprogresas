"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DISTANCES,
  MIN_WEEKS,
  MAX_WEEKS,
  FINISH_TIME_RANGES,
} from "../../../constants/running";
import { formatPace, useRandomWorkout } from "../../../utils/running";
import { SelectDistanceStep } from "../../../components/running/SelectDistanceStep";
import { SetGoalStep } from "../../../components/running/SetGoalStep";
import { SummaryStep } from "../../../components/running/SummaryStep";

export default function Running() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: distance, 2: goal, 3: summary
  const [selected, setSelected] = useState<string | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [goalWeeks, setGoalWeeks] = useState(MIN_WEEKS);
  const randomWorkout = useRandomWorkout(selected);

  // Snap weeks to whole months above 12 weeks
  function handleGoalWeeksChange(v: number) {
    let value = v;
    if (value > 12) {
      value = Math.round(value / 4) * 4;
      if (value > MAX_WEEKS) value = MAX_WEEKS;
      if (value < 16) value = 16;
    }
    setGoalWeeks(value);
  }

  // Set default finish time when distance is selected
  useEffect(() => {
    if (selected && selected !== "none") {
      const { min, max } = FINISH_TIME_RANGES[selected] || {};
      setFinishTime(Math.floor((min + max) / 2));
    } else {
      setFinishTime(null);
    }
  }, [selected]);

  // Calculate pace (min/km) for summary
  let calculatedPace: string | null = null;
  if (step === 3 && selected && selected !== "none" && finishTime !== null) {
    const dist = DISTANCES.find((d) => d.value === selected)?.km;
    if (dist && dist > 0) {
      const paceSec = finishTime / dist;
      calculatedPace = formatPace(paceSec) + " min/km";
    }
  }

  if (step === 1) {
    return (
      <SelectDistanceStep
        distances={DISTANCES}
        onSelect={(val) => {
          setSelected(val);
          if (val === "none") {
            setStep(3);
          } else {
            setStep(2);
          }
        }}
        onBack={() => router.push("/")}
      />
    );
  }

  if (step === 2 && selected !== null && selected !== "none") {
    return (
      <SetGoalStep
        selected={selected}
        finishTime={finishTime!}
        goalWeeks={goalWeeks}
        onFinishTimeChange={setFinishTime}
        onGoalWeeksChange={handleGoalWeeksChange}
        onContinue={() => setStep(3)}
        onBack={() => setStep(1)}
      />
    );
  }

  if (step === 3 && selected !== null) {
    return (
      <SummaryStep
        selected={selected}
        finishTime={finishTime}
        goalWeeks={goalWeeks}
        calculatedPace={calculatedPace}
        randomWorkout={randomWorkout}
        onBack={() => setStep(selected === "none" ? 1 : 2)}
      />
    );
  }

  return null;
}
