"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppContainer } from "@/components/AppContainer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-8 text-primary">Select a Sport</h1>
        <div className="flex flex-col gap-8 w-full max-w-card">
          <Button
            className="w-full"
            onClick={() => router.push("/sports/running")}
          >
            Running
          </Button>
          <Button className="w-full" onClick={() => {}}>
            General Fitness
          </Button>
        </div>
      </div>
    </AppContainer>
  );
}
