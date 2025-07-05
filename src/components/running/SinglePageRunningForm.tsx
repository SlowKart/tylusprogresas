"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StepLayout } from "@/components/StepLayout"
import { AppContainer } from "@/components/AppContainer"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { authService } from "@/lib/auth"
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
  const router = useRouter();
  const { user, isAuthenticated, refreshActiveProgram } = useAuth();
  const [step, setStep] = useState<"basics" | "goals" | "summary">("basics")
  const [level, setLevel] = useState<ExperienceLevel>("beginner")
  const [frequency, setFrequency] = useState<number>(3)
  const [selected, setSelected] = useState<DistanceValue>("5km")
  const [finishTime, setFinishTime] = useState<number>(1800) // 30 minutes default
  const [goalWeeks, setGoalWeeks] = useState(MIN_WEEKS)
  const [isLoading, setIsLoading] = useState(false);
  
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
        <AppContainer>
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="flex flex-col items-center justify-center flex-1 p-4">
            <h1 className="text-3xl font-bold mb-8 text-primary">Random Workout</h1>
            
            <div className="flex flex-col gap-8 w-full max-w-card">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center">Your workout:</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center font-medium mb-4">{randomWorkout}</p>
                  <p className="text-sm text-muted-foreground text-center">
                    This is a randomly generated workout based on your experience level. Enjoy your run!
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                {isAuthenticated && user && (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const userSelections = {
                          sportType: 'running' as const,
                          level,
                          frequency,
                          distance: selected,
                          finishTime: finishTime,
                          goalWeeks
                        };

                        // For running, we'll store the selections and generate a simple program
                        const programData = {
                          workout: randomWorkout,
                          selections: userSelections
                        };

                        await authService.saveProgram(user.id, 'running', userSelections, programData);
                        await refreshActiveProgram();
                        
                        // Navigate to dashboard
                        router.push("/dashboard");
                      } catch {
                        // Program save failed - stay on current page
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Program"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("basics")}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </AppContainer>
      )
    }

    return (
      <AppContainer>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">Your Running Goal</h1>
          
          <div className="flex flex-col gap-8 w-full max-w-card">
            {/* Goal Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Goal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Distance:</span>
                  <Badge variant="outline">
                    {DISTANCES.find((d) => d.value === selected)?.label}
                  </Badge>
                </div>
                
                {finishTime !== null && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">Finish time:</span>
                      <span className="text-muted-foreground">{formatTime(finishTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pace:</span>
                      <span className="text-muted-foreground">{calculatedPace}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  <span className="font-medium">Time to achieve:</span>
                  <span className="text-muted-foreground">{formatWeeks(goalWeeks)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Experience level:</span>
                  <Badge variant="secondary">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Training frequency:</span>
                  <span className="text-muted-foreground">{frequency}x / week</span>
                </div>
              </CardContent>
            </Card>

            {/* Training Plan Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To reach your goal, follow a structured training plan, gradually
                  increase your weekly mileage, and include a mix of easy runs,
                  intervals, and long runs. Remember to rest and listen to your body.
                  Good luck!
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              {isAuthenticated && user && (
                <Button
                  className="w-full"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const userSelections = {
                        sportType: 'running' as const,
                        level,
                        frequency,
                        distance: selected,
                        finishTime: finishTime,
                        goalWeeks
                      };

                      // For running, we'll store the selections and goal details
                      const programData = {
                        goal: {
                          distance: DISTANCES.find((d) => d.value === selected)?.label,
                          finishTime: formatTime(finishTime),
                          pace: calculatedPace,
                          weeks: formatWeeks(goalWeeks),
                          level,
                          frequency
                        },
                        selections: userSelections
                      };

                      await authService.saveProgram(user.id, 'running', userSelections, programData);
                      await refreshActiveProgram();
                      
                      // Navigate to dashboard
                      router.push("/dashboard");
                    } catch {
                      // Program save failed - stay on current page
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Running Plan"}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("goals")}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </AppContainer>
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