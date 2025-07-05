"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Bodybuilding() {
  const router = useRouter();

  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-8 text-primary">Bodybuilding</h1>
        <div className="flex flex-col gap-8 w-full max-w-card">
          <p className="text-center text-muted-foreground">
            Bodybuilding programs coming soon! Build muscle, strength, and achieve your physique goals.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/")}
          >
            Back to Sports
          </Button>
        </div>
      </div>
    </AppContainer>
  );
}