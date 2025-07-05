// Utility functions for running logic
import { useState, useEffect } from "react";
import { DistanceValue, ExperienceLevel } from "@/constants/running";

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

export function getRandomWorkout(level: ExperienceLevel = "beginner") {
  const workouts = {
    beginner: [
      "Run 20-30 minutes at a comfortable pace. Take walking breaks if needed.",
      "Walk-run intervals: 2 minutes running, 1 minute walking. Repeat 8 times.",
      "Easy 3km jog followed by 10 minutes of stretching.",
      "Hill walk: Find a gentle slope and walk up, jog down slowly. Repeat 6 times.",
      "Easy pace run for 25 minutes. Focus on breathing and posture.",
    ],
    intermediate: [
      "Run 5km at a comfortable pace. Cool down with 10 minutes of stretching.",
      "Interval session: 8x 400m fast with 200m jog recovery.",
      "Tempo run: 20 minutes at a steady, challenging pace.",
      "Hill repeats: 6x 2-minute uphill, walk down for recovery.",
      "Long run: 45 minutes at an easy pace. Stay hydrated!",
    ],
    advanced: [
      "10km tempo run at comfortably hard pace. Cool down with stretching.",
      "Track session: 6x 800m at 5km pace with 400m recovery jogs.",
      "Fartlek run: 40 minutes with 8x 2-minute surges every 3 minutes.",
      "Hill repeats: 10x 90-seconds uphill at 5km effort, jog down recovery.",
      "Long run: 75-90 minutes at aerobic pace with negative split.",
    ]
  };
  
  const levelWorkouts = workouts[level];
  return levelWorkouts[Math.floor(Math.random() * levelWorkouts.length)];
}

export function useRandomWorkout(selected: DistanceValue | null, level: ExperienceLevel = "beginner") {
  const [randomWorkout, setRandomWorkout] = useState<string | null>(null);
  useEffect(() => {
    if (selected === "none" && randomWorkout === null) {
      setRandomWorkout(getRandomWorkout(level));
    }
    if (selected !== "none") {
      setRandomWorkout(null);
    }
  }, [selected, level, randomWorkout]);
  return randomWorkout;
}

export { formatTime as formatFinishTime };
