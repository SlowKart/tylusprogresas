import * as runningUtils from "../running";

describe("running utils", () => {
  describe("formatFinishTime", () => {
    it("formats seconds to HH:MM:SS", () => {
      expect(runningUtils.formatFinishTime(3661)).toBe("01:01:01");
    });
    it("handles zero seconds", () => {
      expect(runningUtils.formatFinishTime(0)).toBe("00:00:00");
    });
  });

  describe("getRandomWorkout", () => {
    it("returns a workout string", () => {
      const workout = runningUtils.getRandomWorkout();
      expect(typeof workout).toBe("string");
      const knownWorkouts = [
        "Run 5km at a comfortable pace. Cool down with 10 minutes of stretching.",
        "Interval session: 10x 400m fast with 200m walk/jog recovery.",
        "Tempo run: 20 minutes at a steady, challenging pace.",
        "Hill repeats: 8x 1-minute uphill, walk down for recovery.",
        "Long run: 60 minutes at an easy pace. Hydrate well!",
      ];
      expect(knownWorkouts).toContain(workout);
    });
  });
});
