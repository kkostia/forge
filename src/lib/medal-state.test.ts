import { describe, expect, it } from "vitest";
import { bestWorkingWeight, computeGroupMedals, type AnchorInfo } from "@/lib/medal-state";
import type { TrainingSet } from "@/lib/progress";
import type { MuscleGroup } from "@/lib/constants";

function set(partial: Partial<TrainingSet>): TrainingSet {
  return {
    weightKg: 0,
    reps: 5,
    date: "2026-06-08",
    exerciseSlug: "barbell-bench-press",
    exerciseName: "Bench",
    muscleGroup: "CHEST",
    isAnchor: true,
    ...partial,
  };
}

const benchAnchor: AnchorInfo = {
  slug: "barbell-bench-press",
  name: "Bench",
  thresholds: { bronze: 20, silver: 50, gold: 75, platinum: 100 },
};

describe("bestWorkingWeight", () => {
  it("counts only sets with reps >= MIN_REPS_FOR_PR (3)", () => {
    const sets = [
      set({ weightKg: 80, reps: 1 }), // a 1-rep max — not a working set
      set({ weightKg: 70, reps: 5 }), // working
      set({ weightKg: 60, reps: 3 }), // working (boundary)
    ];
    expect(bestWorkingWeight(sets, "barbell-bench-press")).toBe(70);
  });

  it("ignores other exercises", () => {
    const sets = [set({ exerciseSlug: "squat", weightKg: 200, reps: 5 })];
    expect(bestWorkingWeight(sets, "barbell-bench-press")).toBe(0);
  });
});

describe("computeGroupMedals", () => {
  const anchors: Partial<Record<MuscleGroup, AnchorInfo>> = { CHEST: benchAnchor };

  it("derives the group tier from the best working set", () => {
    const medals = computeGroupMedals([set({ weightKg: 80, reps: 5 })], anchors);
    const chest = medals.find((m) => m.group === "CHEST")!;
    expect(chest.tier).toBe("GOLD");
    expect(chest.bestWeight).toBe(80);
    expect(chest.earned).toEqual(["BRONZE", "SILVER", "GOLD"]);
  });

  it("does not count a heavy single below the working-rep cutoff", () => {
    const medals = computeGroupMedals([set({ weightKg: 100, reps: 1 })], anchors);
    expect(medals.find((m) => m.group === "CHEST")!.tier).toBe("NONE");
  });

  it("returns NONE for groups with no anchor or no data", () => {
    const medals = computeGroupMedals([], anchors);
    expect(medals).toHaveLength(6);
    expect(medals.find((m) => m.group === "LEGS")!.tier).toBe("NONE");
    expect(medals.find((m) => m.group === "CHEST")!.tier).toBe("NONE");
  });
});
