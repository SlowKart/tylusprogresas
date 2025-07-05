"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StepLayout } from "@/components/StepLayout"
import {
  DISTANCES,
  FINISH_TIME_RANGES,
  MIN_WEEKS,
  MAX_WEEKS,
  DistanceValue,
  ExperienceLevel,
} from "@/constants/running"
import { formatTime, formatWeeks, formatPace, useRandomWorkout } from "@/utils/running"

interface SinglePageRunningFormProps {
  onBack: () => void
}

export function SinglePageRunningForm({ onBack }: SinglePageRunningFormProps) {
  const [step, setStep] = useState<"basics" | "goals" | "summary">("basics")
  const [level, setLevel] = useState<ExperienceLevel>("beginner")
  const [frequency, setFrequency] = useState<number>(3)
  const [selected, setSelected] = useState<DistanceValue>("5km")
  const [finishTime, setFinishTime] = useState<number>(1800) // 30 minutes default
  const [goalWeeks, setGoalWeeks] = useState(MIN_WEEKS)
  
  const randomWorkout = useRandomWorkout(selected, level)

  // Update finish time when distance changes
  useEffect(() => {
    if (selected && selected !== "none") {
      const { min, max } = FINISH_TIME_RANGES[selected] || {}
      setFinishTime(Math.floor((min + max) / 2))
    }
  }, [selected])

  // Snap weeks to whole months above 12 weeks
  function handleGoalWeeksChange(v: number) {
    let value = v
    if (value > 12) {
      value = Math.round(value / 4) * 4
      if (value > MAX_WEEKS) value = MAX_WEEKS
      if (value < 16) value = 16
    }
    setGoalWeeks(value)
  }

  // Calculate pace for summary
  let calculatedPace: string | null = null
  if (selected && selected !== "none" && finishTime !== null) {
    const dist = DISTANCES.find((d) => d.value === selected)?.km
    if (dist && dist > 0) {
      const paceSec = finishTime / dist
      calculatedPace = formatPace(paceSec) + " min/km"
    }
  }

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selected === "none") {
      setStep("summary")
    } else {
      setStep("goals")
    }
  }

  const handleGoalsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("summary")
  }

  if (step === "summary") {
    if (selected === "none") {
      return (
        <StepLayout title="Random Workout" onBack={() => setStep("basics")}>
          <div className="bg-background shadow-md rounded-xl p-8 w-full flex flex-col items-center">
            <div className="mb-4 text-primary text-center">
              <span className="block text-xl font-bold mb-2">Your workout:</span>
              <div className="mt-2 text-base text-foreground font-medium">
                {randomWorkout}
              </div>
            </div>
            <p className="text-base text-foreground text-center leading-relaxed">
              This is a randomly generated workout based on your experience level. Enjoy your run!
            </p>
          </div>
        </StepLayout>
      )
    }

    return (
      <StepLayout title="Your Running Goal" onBack={() => setStep("goals")}>
        <div className="w-full flex flex-col items-center p-0 gap-4">
          <div className="mb-4 text-primary w-full">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-center">Goal Summary</span>
              <span className="text-base text-foreground text-center">
                <span className="font-semibold">Distance:</span>{" "}
                {DISTANCES.find((d) => d.value === selected)?.label}
              </span>
              {finishTime !== null && (
                <>
                  <span className="text-base text-foreground text-center">
                    <span className="font-semibold">Finish time:</span>{" "}
                    {formatTime(finishTime)}
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
              <span className="text-base text-foreground text-center">
                <span className="font-semibold">Experience level:</span>{" "}
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
              <span className="text-base text-foreground text-center">
                <span className="font-semibold">Training frequency:</span>{" "}
                {frequency}x / week
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
    )
  }

  if (step === "basics") {
    return (
      <StepLayout title="Basic Information" onBack={onBack}>
        <form onSubmit={handleBasicsSubmit} className="flex flex-col gap-6 w-full p-0">
          
          {/* 1. Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-lg font-semibold text-primary">
              Experience Level
            </Label>
            <Select value={level} onValueChange={(value) => setLevel(value as ExperienceLevel)}>
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

          {/* 2. Distance Selection */}
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-lg font-semibold text-primary">
              Target Distance
            </Label>
            <Select value={selected} onValueChange={(value) => setSelected(value as DistanceValue)}>
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
            {selected === "none" ? "Get My Workout" : "Continue"}
          </Button>
        </form>
      </StepLayout>
    )
  }

  if (step === "goals") {
    return (
      <StepLayout title="Training Goals" onBack={() => setStep("basics")}>
        <form onSubmit={handleGoalsSubmit} className="flex flex-col gap-6 w-full p-0">
          
          {/* 1. Training Frequency */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-primary">
              Training Frequency
            </Label>
            <div className="space-y-2">
              <Slider
                value={[frequency]}
                min={2}
                max={7}
                step={1}
                onValueChange={([val]) => setFrequency(val)}
                className="w-full"
              />
              <div className="text-center">
                <span className="font-medium text-primary text-base">
                  {frequency}x / week
                </span>
              </div>
            </div>
          </div>

          {/* 2. Conditional Goal Time Slider */}
          {selected !== "none" && (
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-primary">
                Target Finish Time
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[finishTime]}
                  min={FINISH_TIME_RANGES[selected].min}
                  max={FINISH_TIME_RANGES[selected].max}
                  step={60}
                  onValueChange={([val]) => setFinishTime(val)}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="font-medium text-primary text-base">
                    {formatTime(finishTime)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Training Duration */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-primary">
              Time to Achieve Goal
            </Label>
            <div className="space-y-2">
              <Slider
                value={[goalWeeks]}
                min={MIN_WEEKS}
                max={MAX_WEEKS}
                step={1}
                onValueChange={([val]) => handleGoalWeeksChange(val)}
                className="w-full"
              />
              <div className="text-center">
                <span className="font-medium text-primary text-base">
                  {formatWeeks(goalWeeks)}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Create My Running Plan
          </Button>
        </form>
      </StepLayout>
    )
  }

  return null
}