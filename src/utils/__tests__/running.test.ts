import * as runningUtils from "../running";
import { renderHook, act } from "@testing-library/react";
import { DistanceValue } from "@/constants/running";

describe("running utils", () => {
  describe("formatTime", () => {
    it("formats seconds to HH:MM:SS", () => {
      expect(runningUtils.formatTime(3661)).toBe("01:01:01");
    });

    it("handles zero seconds", () => {
      expect(runningUtils.formatTime(0)).toBe("00:00:00");
    });

    it("handles large time values", () => {
      expect(runningUtils.formatTime(7325)).toBe("02:02:05");
    });

    it("handles single digit minutes and seconds", () => {
      expect(runningUtils.formatTime(65)).toBe("00:01:05");
    });

    it("handles only hours", () => {
      expect(runningUtils.formatTime(7200)).toBe("02:00:00");
    });
  });

  describe("formatFinishTime", () => {
    it("formats seconds to HH:MM:SS (alias for formatTime)", () => {
      expect(runningUtils.formatFinishTime(3661)).toBe("01:01:01");
    });

    it("handles zero seconds", () => {
      expect(runningUtils.formatFinishTime(0)).toBe("00:00:00");
    });
  });

  describe("formatPace", () => {
    it("formats pace seconds to MM:SS", () => {
      expect(runningUtils.formatPace(245)).toBe("4:05");
    });

    it("handles zero pace", () => {
      expect(runningUtils.formatPace(0)).toBe("0:00");
    });

    it("handles single digit seconds", () => {
      expect(runningUtils.formatPace(125)).toBe("2:05");
    });

    it("handles single digit minutes", () => {
      expect(runningUtils.formatPace(65)).toBe("1:05");
    });

    it("handles decimal rounding", () => {
      expect(runningUtils.formatPace(245.7)).toBe("4:06");
    });

    it("handles very fast pace", () => {
      expect(runningUtils.formatPace(180)).toBe("3:00");
    });
  });

  describe("formatWeeks", () => {
    it("formats single week", () => {
      expect(runningUtils.formatWeeks(1)).toBe("1 weeks");
    });

    it("formats multiple weeks", () => {
      expect(runningUtils.formatWeeks(8)).toBe("8 weeks");
    });

    it("formats 12 weeks", () => {
      expect(runningUtils.formatWeeks(12)).toBe("12 weeks");
    });

    it("formats weeks as months when > 12", () => {
      expect(runningUtils.formatWeeks(16)).toBe("16 weeks (4 months)");
    });

    it("formats 20 weeks as months", () => {
      expect(runningUtils.formatWeeks(20)).toBe("20 weeks (5 months)");
    });

    it("formats 48 weeks as 1 year", () => {
      expect(runningUtils.formatWeeks(48)).toBe("1 year");
    });

    it("handles edge case of 13 weeks", () => {
      expect(runningUtils.formatWeeks(13)).toBe("13 weeks (3.25 months)");
    });
  });

  describe("getRandomWorkout", () => {
    it("returns a workout string", () => {
      const workout = runningUtils.getRandomWorkout();
      expect(typeof workout).toBe("string");
      expect(workout.length).toBeGreaterThan(0);
    });

    it("returns one of the known workouts", () => {
      const workout = runningUtils.getRandomWorkout();
      const knownWorkouts = [
        "Run 5km at a comfortable pace. Cool down with 10 minutes of stretching.",
        "Interval session: 10x 400m fast with 200m walk/jog recovery.",
        "Tempo run: 20 minutes at a steady, challenging pace.",
        "Hill repeats: 8x 1-minute uphill, walk down for recovery.",
        "Long run: 60 minutes at an easy pace. Hydrate well!",
      ];
      expect(knownWorkouts).toContain(workout);
    });

    it("returns different workouts on multiple calls", () => {
      const workouts = new Set();
      for (let i = 0; i < 10; i++) {
        workouts.add(runningUtils.getRandomWorkout());
      }
      // Should have at least 2 different workouts in 10 calls
      expect(workouts.size).toBeGreaterThan(1);
    });
  });

  describe("useRandomWorkout", () => {
    it("returns null initially", () => {
      const { result } = renderHook(() => runningUtils.useRandomWorkout(null));
      expect(result.current).toBe(null);
    });

    it("returns null when selected is not 'none'", () => {
      const { result } = renderHook(() =>
        runningUtils.useRandomWorkout("5km" as DistanceValue)
      );
      expect(result.current).toBe(null);
    });

    it("generates random workout when selected is 'none'", () => {
      const { result } = renderHook(() =>
        runningUtils.useRandomWorkout("none" as DistanceValue)
      );

      act(() => {
        // Trigger effect
      });

      expect(result.current).toBeTruthy();
      expect(typeof result.current).toBe("string");
      expect(result.current!.length).toBeGreaterThan(0);
    });

    it("clears workout when selected changes from 'none' to other value", () => {
      const { result, rerender } = renderHook(
        ({ selected }) => runningUtils.useRandomWorkout(selected),
        { initialProps: { selected: "none" as DistanceValue } }
      );

      act(() => {
        // Trigger effect for 'none'
      });

      expect(result.current).toBeTruthy();

      rerender({ selected: "5km" as DistanceValue });

      act(() => {
        // Trigger effect for '5km'
      });

      expect(result.current).toBe(null);
    });

    it("does not regenerate workout when selected remains 'none'", () => {
      const { result, rerender } = renderHook(
        ({ selected }) => runningUtils.useRandomWorkout(selected),
        { initialProps: { selected: "none" as DistanceValue } }
      );

      act(() => {
        // Trigger effect
      });

      const firstWorkout = result.current;
      expect(firstWorkout).toBeTruthy();

      rerender({ selected: "none" as DistanceValue });

      act(() => {
        // Trigger effect again
      });

      expect(result.current).toBe(firstWorkout);
    });

    it("generates new workout when selected changes from other to 'none'", () => {
      const { result, rerender } = renderHook(
        ({ selected }) => runningUtils.useRandomWorkout(selected),
        { initialProps: { selected: "5km" as DistanceValue } }
      );

      expect(result.current).toBe(null);

      rerender({ selected: "none" as DistanceValue });

      act(() => {
        // Trigger effect
      });

      expect(result.current).toBeTruthy();
      expect(typeof result.current).toBe("string");
    });
  });
});
