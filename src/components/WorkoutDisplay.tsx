"use client";

import React from "react";
import { Day } from "@/types/simpleProgram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkoutDisplayProps {
  day: Day;
  weekNumber: number;
  programName: string;
}

/**
 * Displays a single workout day with exercises and details
 * Shows rest day layout for days with no exercises
 */
export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ day, weekNumber, programName }) => {
  const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  if (day.exercises.length === 0) {
    return (
      <div className="w-full max-w-card mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-primary">
            {programName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Week {weekNumber} • {dayNames[day.day]}
          </p>
        </div>

        {/* Rest Day Card */}
        <Card className="border-muted">
          <CardHeader className="text-center py-12">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-muted text-muted-foreground text-lg px-4 py-2">
                REST DAY
              </Badge>
              <CardTitle className="text-xl text-muted-foreground">
                Time to recover and recharge
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Rest is just as important as training. Take this time to let your body recover.
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-card mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-primary">
          {programName}
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Week {weekNumber} • {dayNames[day.day]}
          </p>
          <Badge variant="outline">
            {day.name}
          </Badge>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {day.exercises.map((exercise, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {exercise.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {exercise.details}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};