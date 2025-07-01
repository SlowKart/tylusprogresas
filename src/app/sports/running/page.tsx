"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CustomSlider } from "@/components/CustomSlider";
import { Button } from "@/components/Button";

// --- Types & Constants ---
interface DistanceOption {
  label: string;
  value: string;
  km: number;
}

const DISTANCES: DistanceOption[] = [
  { label: "5 km", value: "5km", km: 5 },
  { label: "10 km", value: "10km", km: 10 },
  { label: "Half Marathon", value: "halfmarathon", km: 21.0975 },
  { label: "Marathon", value: "marathon", km: 42.195 },
  { label: "No Specific Goal", value: "none", km: 0 },
];

const FINISH_TIME_RANGES: Record<string, { min: number; max: number }> = {
  "5km": { min: 15 * 60, max: 60 * 60 },
  "10km": { min: 30 * 60, max: 120 * 60 },
  halfmarathon: { min: 60 * 60, max: 240 * 60 },
  marathon: { min: 120 * 60, max: 420 * 60 },
};

const MIN_WEEKS = 4;
const MAX_WEEKS = 48;

// --- Utility Functions ---
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map((v, i) => (i === 0 && v === 0 ? null : v.toString().padStart(2, "0")))
    .filter(Boolean)
    .join(":");
}

function formatPace(paceSeconds: number) {
  const min = Math.floor(paceSeconds / 60);
  const sec = Math.round(paceSeconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function formatWeeks(weeks: number) {
  if (weeks === 48) return "1 year";
  if (weeks > 12) return `${weeks} weeks (${weeks / 4} months)`;
  return `${weeks} weeks`;
}

// --- UI Components ---
function BackArrow({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="mr-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      style={{ lineHeight: 0 }}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

function StepLayout({
  children,
  onBack,
  title,
}: {
  children: ReactNode;
  onBack?: () => void;
  title: string;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="flex items-center mb-8">
        {onBack && <BackArrow onClick={onBack} />}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      {children}
    </main>
  );
}

function GoalSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue: (v: number) => string;
}) {
  return (
    <div>
      <div className="text-lg font-semibold mb-2 text-gray-800">{label}</div>
      <div className="text-center text-gray-900 font-sans font-mono text-lg mb-2">
        {formatValue(value)}
      </div>
      <CustomSlider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        ariaLabel={label}
      />
    </div>
  );
}

function DistanceButton({
  option,
  onSelect,
}: {
  option: DistanceOption;
  onSelect: (value: string) => void;
}) {
  return (
    <Button
      variant="primary"
      className="w-full"
      onClick={() => onSelect(option.value)}
      aria-label={`Select ${option.label}`}
    >
      {option.label}
    </Button>
  );
}

// --- Main Component ---
export default function Running() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: distance, 2: goal, 3: summary
  const [selected, setSelected] = useState<string | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [goalWeeks, setGoalWeeks] = useState(MIN_WEEKS);

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

  // --- Step 1: Select distance ---
  if (step === 1) {
    return (
      <StepLayout title="Select Your Distance" onBack={() => router.push("/")}>
        <div className="flex flex-col gap-6 w-full max-w-[393px]">
          {DISTANCES.map((d) => (
            <DistanceButton
              key={d.value}
              option={d}
              onSelect={(val) => {
                setSelected(val);
                setStep(2);
              }}
            />
          ))}
        </div>
      </StepLayout>
    );
  }

  // --- Step 2: Set goal (finish time + weeks) ---
  if (step === 2 && selected !== null) {
    return (
      <StepLayout title="Set Your Goal" onBack={() => setStep(1)}>
        <form
          className="flex flex-col gap-6 w-full max-w-[393px] bg-white shadow-md rounded-xl p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
        >
          {selected !== "none" && finishTime !== null && (
            <GoalSlider
              label="Select your target finish time:"
              value={finishTime}
              onChange={setFinishTime}
              min={FINISH_TIME_RANGES[selected].min}
              max={FINISH_TIME_RANGES[selected].max}
              step={60}
              formatValue={formatTime}
            />
          )}
          <GoalSlider
            label="Time to achieve this goal:"
            value={goalWeeks}
            onChange={handleGoalWeeksChange}
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

  // --- Step 3: Summary ---
  if (step === 3 && selected !== null) {
    return (
      <StepLayout title="Your Running Goal" onBack={() => setStep(2)}>
        <div className="bg-white shadow-md rounded-xl p-8 max-w-[393px] w-full flex flex-col items-center">
          <div className="mb-4 text-gray-700">
            <div>
              <b>Distance:</b>{" "}
              {DISTANCES.find((d) => d.value === selected)?.label}
            </div>
            {selected !== "none" && finishTime !== null && (
              <>
                <div>
                  <b>Finish time:</b> {formatTime(finishTime)}
                </div>
                <div>
                  <b>Pace:</b> {calculatedPace}
                </div>
              </>
            )}
            <div>
              <b>Time to achieve:</b> {formatWeeks(goalWeeks)}
            </div>
          </div>
          <p className="text-gray-600 text-center mb-2">
            To reach your goal, follow a structured training plan, gradually
            increase your weekly mileage, and include a mix of easy runs,
            intervals, and long runs. Remember to rest and listen to your body.
            Good luck!
          </p>
        </div>
      </StepLayout>
    );
  }

  return null;
}
