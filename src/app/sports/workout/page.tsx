"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorkoutDisplay } from "@/components/WorkoutDisplay";
import { generateMockWorkout, WorkoutOptions } from "@/utils/mockWorkoutGenerator";
import { SimpleProgram, Day } from "@/types/simpleProgram";

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [program, setProgram] = useState<SimpleProgram | null>(null);
  const [currentDay, setCurrentDay] = useState<Day | null>(null);

  useEffect(() => {
    // Extract parameters from URL
    const sport = searchParams.get("sport") as "bodybuilding" | "general-fitness";
    const daysPerWeek = parseInt(searchParams.get("days") || "3");
    const equipmentString = searchParams.get("equipment") || "";
    const equipment = equipmentString ? equipmentString.split(",") : [];
    const cardioType = searchParams.get("cardio") || undefined;

    if (!sport) {
      router.push("/");
      return;
    }

    // Generate workout program
    const options: WorkoutOptions = {
      sport,
      daysPerWeek,
      equipment,
      cardioType
    };

    const generatedProgram = generateMockWorkout(options);
    setProgram(generatedProgram);

    // Set current day to first workout day (non-rest day)
    const firstWeek = generatedProgram.weeks[0];
    const firstWorkoutDay = firstWeek.days.find(day => day.exercises.length > 0);
    if (firstWorkoutDay) {
      setCurrentDay(firstWorkoutDay);
    } else {
      setCurrentDay(firstWeek.days[0]); // Fallback to first day
    }
  }, [searchParams, router]);

  if (!program || !currentDay) {
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

  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="w-full max-w-card">
          <WorkoutDisplay 
            day={currentDay}
            weekNumber={1}
            programName={program.metadata.name}
          />
          
          {/* Navigation */}
          <div className="flex flex-col gap-4 mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              Back to Settings
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