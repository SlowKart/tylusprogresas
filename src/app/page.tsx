"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppContainer } from "@/components/AppContainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, isLoading, router]);

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
        
        {/* Authentication notice for guests */}
        {!isAuthenticated && (
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
