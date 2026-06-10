import { describe, expect, it } from "vitest";
import {
  exerciseProgress,
  personalRecords,
  totalVolume,
  weekStartOf,
  weeklyVolumeByGroup,
  type TrainingSet,
} from "@/lib/progress";

const sets: TrainingSet[] = [
  s(60, 5, "2026-06-01", "bench", "Bench", "CHEST", true),
  s(70, 3, "2026-06-08", "bench", "Bench", "CHEST", true),
  s(80, 1, "2026-06-08", "bench", "Bench", "CHEST", true), // heavy single
  s(100, 5, "2026-06-08", "squat", "Squat", "LEGS", true),
];

function s(
  weightKg: number,
  reps: number,
  date: string,
  slug: string,
  name: string,
  group: TrainingSet["muscleGroup"],
  isAnchor: boolean,
): TrainingSet {
  return {
    weightKg,
    reps,
    date,
    exerciseSlug: slug,
    exerciseName: name,
    muscleGroup: group,
    isAnchor,
  };
}

describe("totalVolume", () => {
  it("sums weight × reps across all sets", () => {
    expect(totalVolume(sets)).toBe(60 * 5 + 70 * 3 + 80 * 1 + 100 * 5);
  });
});

describe("personalRecords", () => {
  it("separates best weight (any reps) from best working weight", () => {
    const bench = personalRecords(sets).find((p) => p.slug === "bench")!;
    expect(bench.bestWeight).toBe(80); // heaviest, even at 1 rep
    expect(bench.bestWorkingWeight).toBe(70); // heaviest with reps >= 3
  });

  it("orders anchors first, then by volume", () => {
    expect(personalRecords(sets).map((p) => p.slug)).toEqual(["bench", "squat"]);
  });
});

describe("weekStartOf", () => {
  it("returns the Monday of the week", () => {
    expect(weekStartOf("2026-06-10")).toBe("2026-06-08"); // Wed -> Mon
    expect(weekStartOf("2026-06-08")).toBe("2026-06-08"); // Mon -> itself
  });
});

describe("weeklyVolumeByGroup", () => {
  it("buckets volume by week and muscle group", () => {
    const weeks = weeklyVolumeByGroup(sets);
    expect(weeks).toHaveLength(2);
    expect(weeks[0].CHEST).toBe(300); // 60×5 on 06-01
    expect(weeks[1].CHEST).toBe(70 * 3 + 80 * 1);
    expect(weeks[1].LEGS).toBe(500);
  });

  it("returns an empty array with no sets", () => {
    expect(weeklyVolumeByGroup([])).toEqual([]);
  });
});

describe("exerciseProgress", () => {
  it("returns the best weight per training day, oldest first", () => {
    const points = exerciseProgress(sets, "bench");
    expect(points.map((p) => p.bestWeight)).toEqual([60, 80]);
    expect(points[0].date).toBe("2026-06-01");
  });
});
