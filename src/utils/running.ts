// Utility functions for running logic
import { useState, useEffect } from "react";

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}

export function formatPace(paceSeconds: number) {
  const min = Math.floor(paceSeconds / 60);
  const sec = Math.round(paceSeconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function formatWeeks(weeks: number) {
  if (weeks === 48) return "1 year";
  if (weeks > 12) return `${weeks} weeks (${weeks / 4} months)`;
  return `${weeks} weeks`;
}

export function getRandomWorkout() {
  const workouts = [
    "Run 5km at a comfortable pace. Cool down with 10 minutes of stretching.",
    "Interval session: 10x 400m fast with 200m walk/jog recovery.",
    "Tempo run: 20 minutes at a steady, challenging pace.",
    "Hill repeats: 8x 1-minute uphill, walk down for recovery.",
    "Long run: 60 minutes at an easy pace. Hydrate well!",
  ];
  return workouts[Math.floor(Math.random() * workouts.length)];
}

export function useRandomWorkout(selected: string | null) {
  const [randomWorkout, setRandomWorkout] = useState<string | null>(null);
  useEffect(() => {
    if (selected === "none" && randomWorkout === null) {
      setRandomWorkout(getRandomWorkout());
    }
    if (selected !== "none") {
      setRandomWorkout(null);
    }
  }, [selected]);
  return randomWorkout;
}

export { formatTime as formatFinishTime };
