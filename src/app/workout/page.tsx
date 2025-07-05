"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorkoutDisplay } from "@/components/WorkoutDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";
import { UserProgram, UserProgress } from "@/types/auth";
import { Day, SimpleProgram } from "@/types/simpleProgram";

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [program, setProgram] = useState<UserProgram | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentDay, setCurrentDay] = useState<Day | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const programId = searchParams.get("programId");
        const week = parseInt(searchParams.get("week") || "1");
        const day = parseInt(searchParams.get("day") || "1");

        if (!programId || !isAuthenticated || !user) {
          router.push("/");
          return;
        }

        // Get the program
        const programs = await authService.getUserPrograms(user.id);
        const currentProgram = programs.find(p => p.id === programId);
        
        if (!currentProgram) {
          router.push("/dashboard");
          return;
        }

        // Get progress
        const userProgress = await authService.getUserProgress(user.id, programId);
        
        if (!userProgress) {
          router.push("/dashboard");
          return;
        }

        setProgram(currentProgram);
        setProgress(userProgress);

        // Find the current day from the program data
        if (currentProgram.sportType === 'running') {
          // For running, create a mock day structure
          const programData = currentProgram.programData as Record<string, unknown>;
          const workoutName = (programData.workout as string) || "Run";
          const mockDay: Day = {
            day: day,
            name: "Running Workout",
            exercises: [{
              name: workoutName,
              details: "Follow your running plan"
            }]
          };
          setCurrentDay(mockDay);
        } else {
          // For bodybuilding/general-fitness, extract from SimpleProgram structure
          const programData = currentProgram.programData as SimpleProgram;
          if (programData.weeks && programData.weeks[week - 1]) {
            const weekData = programData.weeks[week - 1];
            const dayData = weekData.days.find((d: Day) => d.day === day);
            if (dayData) {
              setCurrentDay(dayData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading workout:', error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [searchParams, router, user, isAuthenticated]);

  const handleCompleteWorkout = async () => {
    if (!user || !program || !progress) return;

    try {
      const week = parseInt(searchParams.get("week") || "1");
      const day = parseInt(searchParams.get("day") || "1");
      
      // Mark day as completed
      const completedDay = `${week}-${day}`;
      const updatedCompletedDays = [...progress.completedDays];
      
      if (!updatedCompletedDays.includes(completedDay)) {
        updatedCompletedDays.push(completedDay);
      }

      // Update progress
      await authService.updateProgress(user.id, program.id, {
        completedDays: updatedCompletedDays,
        currentWeek: week,
        currentDay: day + 1 // Move to next day
      });

      // Navigate back to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  if (isLoading) {
    return (
      <AppContainer>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-primary">Loading workout...</h1>
          </div>
        </div>
      </AppContainer>
    );
  }

  if (!program || !currentDay) {
    return (
      <AppContainer>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-primary">Workout not found</h1>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AppContainer>
    );
  }

  // For running programs, show special layout
  if (program.sportType === 'running') {
    return (
      <AppContainer>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="w-full max-w-card">
            <h1 className="text-3xl font-bold mb-2 text-primary">{program.programName}</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Running Program
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Today&apos;s Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium mb-4">{currentDay.exercises[0].name}</p>
                <p className="text-sm text-muted-foreground">{currentDay.exercises[0].details}</p>
              </CardContent>
            </Card>

            {Boolean((program.programData as Record<string, unknown>).goal) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Your Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(() => {
                    const goal = (program.programData as Record<string, unknown>).goal as Record<string, unknown>;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="font-medium">Distance:</span>
                          <Badge variant="outline">{goal.distance as string}</Badge>
                        </div>
                        {goal.finishTime && (
                          <div className="flex justify-between">
                            <span className="font-medium">Target Time:</span>
                            <span className="text-muted-foreground">{goal.finishTime as string}</span>
                          </div>
                        )}
                        {goal.pace && (
                          <div className="flex justify-between">
                            <span className="font-medium">Target Pace:</span>
                            <span className="text-muted-foreground">{goal.pace as string}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col gap-4">
              <Button className="w-full" onClick={handleCompleteWorkout}>
                Complete Workout
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </AppContainer>
    );
  }

  // For bodybuilding/general-fitness programs, use the existing WorkoutDisplay
  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="w-full max-w-card">
          <WorkoutDisplay 
            day={currentDay}
            weekNumber={progress?.currentWeek || 1}
            programName={program.programName}
          />
          
          <div className="flex flex-col gap-4 mt-8">
            <Button className="w-full" onClick={handleCompleteWorkout}>
              Complete Workout
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}

export default function WorkoutPage() {
  return (
    <Suspense fallback={
      <AppContainer>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-primary">Loading workout...</h1>
          </div>
        </div>
      </AppContainer>
    }>
      <WorkoutContent />
    </Suspense>
  );
}