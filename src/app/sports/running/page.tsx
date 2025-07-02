"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DISTANCES,
  MIN_WEEKS,
  MAX_WEEKS,
  FINISH_TIME_RANGES,
  DistanceValue,
  ExperienceLevel,
} from "@/constants/running";
import { formatPace, useRandomWorkout } from "@/utils/running";
import { SelectDistanceStep } from "@/components/running/SelectDistanceStep";
import { SetGoalStep } from "@/components/running/SetGoalStep";
import { SummaryStep } from "@/components/running/SummaryStep";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { StepLayout } from "@/components/StepLayout";

type Step = "experience" | "distance" | "goal" | "summary";

export default function Running() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("experience");
  const [level, setLevel] = useState<ExperienceLevel>("beginner");
  const [frequency, setFrequency] = useState<number>(3);
  const [selected, setSelected] = useState<DistanceValue | null>(null);
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
  if (
    step === "summary" &&
    selected &&
    selected !== "none" &&
    finishTime !== null
  ) {
    const dist = DISTANCES.find((d) => d.value === selected)?.km;
    if (dist && dist > 0) {
      const paceSec = finishTime / dist;
      calculatedPace = formatPace(paceSec) + " min/km";
    }
  }

  if (step === "experience") {
  return (
      <StepLayout title="Your Experience" onBack={() => router.push("/")}>
        <form
          className="flex flex-col gap-form w-full max-w-card p-0"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("distance");
          }}
        >
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2 text-primary text-center">
              Select your experience level:
            </div>
            <RadioGroup
              value={level}
              onValueChange={(value) => setLevel(value as ExperienceLevel)}
              className="flex flex-row justify-center gap-6"
              aria-label="Experience Level"
            >
              <RadioGroupItem
                value="beginner"
                id="level-beginner"
                className="peer sr-only"
              />
              <label
                htmlFor="level-beginner"
                className={`px-4 py-2 rounded-lg border cursor-pointer text-base font-medium ${
                  level === "beginner"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                Beginner
              </label>
              <RadioGroupItem
                value="intermediate"
                id="level-intermediate"
                className="peer sr-only"
              />
              <label
                htmlFor="level-intermediate"
                className={`px-4 py-2 rounded-lg border cursor-pointer text-base font-medium ${
                  level === "intermediate"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                Intermediate
              </label>
              <RadioGroupItem
                value="advanced"
                id="level-advanced"
                className="peer sr-only"
              />
              <label
                htmlFor="level-advanced"
                className={`px-4 py-2 rounded-lg border cursor-pointer text-base font-medium ${
                  level === "advanced"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                Advanced
              </label>
            </RadioGroup>
          </div>
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2 text-primary text-center">
              How many times per week do you want to train?
            </div>
            <div className="flex flex-col items-center">
              <div className="text-center text-foreground font-sans font-mono text-lg mb-2">
                {frequency}x / week
              </div>
              <Slider
                value={[frequency]}
                min={2}
                max={7}
                step={1}
                onValueChange={([v]) => setFrequency(v)}
                aria-label="Training Frequency"
                className="w-full max-w-slider"
              />
            </div>
      </div>
          <Button type="submit" className="w-full mt-form-btn">
            Continue
          </Button>
        </form>
      </StepLayout>
    );
  }

  if (step === "distance") {
    return (
      <SelectDistanceStep
        distances={DISTANCES}
        onSelect={(val) => {
          setSelected(val);
          if (val === "none") {
            setStep("summary");
          } else {
            setStep("goal");
          }
        }}
        onBack={() => setStep("experience")}
      />
    );
  }

  if (step === "goal" && selected !== null && selected !== "none") {
    return (
      <SetGoalStep
        selected={selected}
        finishTime={finishTime!}
        goalWeeks={goalWeeks}
        onFinishTimeChange={setFinishTime}
        onGoalWeeksChange={handleGoalWeeksChange}
        onContinue={() => setStep("summary")}
        onBack={() => setStep("distance")}
      />
    );
  }

  if (step === "summary" && selected !== null) {
    return (
      <SummaryStep
        selected={selected}
        finishTime={finishTime}
        goalWeeks={goalWeeks}
        calculatedPace={calculatedPace}
        randomWorkout={randomWorkout}
        onBack={() => setStep(selected === "none" ? "distance" : "goal")}
        level={level}
        frequency={frequency}
      />
    );
  }

  return null;
}
