"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, activeProgram, progress, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <AppContainer>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-primary">Loading...</h1>
          </div>
        </div>
      </AppContainer>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  const handleStartWorkout = () => {
    if (!activeProgram || !progress) return;

    // Navigate to the current workout
    const params = new URLSearchParams();
    params.set("programId", activeProgram.id);
    params.set("week", progress.currentWeek.toString());
    params.set("day", progress.currentDay.toString());
    
    router.push(`/workout?${params.toString()}`);
  };

  const handleChooseProgram = () => {
    router.push("/");
  };

  const formatSportType = (sportType: string): string => {
    return sportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="w-full max-w-card">
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-primary">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Ready for your next workout?
            </p>
          </div>

          {activeProgram && progress ? (
            <>
              {/* Active Program Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{activeProgram.programName}</CardTitle>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatSportType(activeProgram.sportType)} Program
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Current Progress:</span>
                      <span className="text-muted-foreground">
                        Week {progress.currentWeek}, Day {progress.currentDay}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Completed Workouts:</span>
                      <span className="text-muted-foreground">
                        {progress.completedDays.length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant="secondary">
                        {progress.status.charAt(0).toUpperCase() + progress.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Program Details */}
                    <div className="pt-3 border-t">
                      <div className="text-sm text-muted-foreground space-y-1">
                        {activeProgram.userSelections.daysPerWeek && (
                          <div>Days per week: {activeProgram.userSelections.daysPerWeek}</div>
                        )}
                        {activeProgram.userSelections.equipment && activeProgram.userSelections.equipment.length > 0 && (
                          <div>Equipment: {activeProgram.userSelections.equipment.join(", ")}</div>
                        )}
                        {activeProgram.userSelections.cardioType && (
                          <div>Cardio: {activeProgram.userSelections.cardioType}</div>
                        )}
                        {activeProgram.userSelections.distance && (
                          <div>Target: {activeProgram.userSelections.distance}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleStartWorkout}
                >
                  Start Today&apos;s Workout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleChooseProgram}
                >
                  Choose New Program
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* No Program State */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl text-center">No Active Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground mb-4">
                    You don&apos;t have an active workout program yet. Choose a sport to get started!
                  </p>
                </CardContent>
              </Card>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleChooseProgram}
              >
                Choose Your Program
              </Button>
            </>
          )}

          {/* Account Actions */}
          <div className="mt-8 pt-6 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}