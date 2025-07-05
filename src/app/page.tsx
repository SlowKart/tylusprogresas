"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppContainer } from "@/components/AppContainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Only redirect authenticated users to dashboard if they have an active program
  // and they're not explicitly choosing a new program
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const isChoosingNewProgram = searchParams.get("choosing") === "true";
      
      if (!isChoosingNewProgram) {
        // Check if user has an active program - if so, redirect to dashboard
        // If not, let them stay on home page to choose a program
        const checkActiveProgram = async () => {
          try {
            const { authService } = await import("@/lib/auth");
            const activeProgram = await authService.getActiveProgram(user.id);
            if (activeProgram) {
              router.push("/dashboard");
            }
          } catch {
            // If there's an error checking active program, stay on home page
          }
        };
        checkActiveProgram();
      }
    }
  }, [isAuthenticated, user, isLoading, router, searchParams]);

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
  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-8 text-primary">Select a Sport</h1>
        
        {/* User notices */}
        {isAuthenticated && user ? (
          <div className="w-full max-w-card mb-6 p-4 border border-border rounded-md bg-muted/50">
            <p className="text-sm text-muted-foreground text-center mb-3">
              {searchParams.get("choosing") === "true" 
                ? `Choose a new sport, ${user.name}! This will replace your current program.`
                : `Welcome back, ${user.name}! Choose a sport to create your personalized program.`
              }
            </p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-card mb-6 p-4 border border-border rounded-md bg-muted/50">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Sign in to save your progress and access personalized programs
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => router.push("/auth/login")}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => router.push("/auth/register")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-8 w-full max-w-card">
          <Button
            className="w-full"
            onClick={() => router.push("/sports/running")}
          >
            Running
          </Button>
          <Button
            className="w-full"
            onClick={() => router.push("/sports/bodybuilding")}
          >
            Bodybuilding
          </Button>
          <Button 
            className="w-full" 
            onClick={() => router.push("/sports/general-fitness")}
          >
            General Fitness
          </Button>
        </div>
      </div>
    </AppContainer>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <AppContainer>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-primary">Loading...</h1>
          </div>
        </div>
      </AppContainer>
    }>
      <HomeContent />
    </Suspense>
  );
}
