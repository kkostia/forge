import { describe, expect, it } from "vitest";
import {
  medalForWeight,
  tiersUpTo,
  nextTier,
  progressToNext,
  newlyEarned,
  thresholdFor,
} from "@/lib/medals";
import type { MedalThresholds } from "@/lib/constants";

// The PLAN's worked example for the bench press.
const bench: MedalThresholds = { bronze: 20, silver: 50, gold: 75, platinum: 100 };
// A bodyweight-anchored group (e.g. weighted plank): bronze at 0kg.
const plank: MedalThresholds = { bronze: 0, silver: 10, gold: 20, platinum: 30 };

describe("medalForWeight — tier boundaries", () => {
  it("returns NONE below bronze", () => {
    expect(medalForWeight(bench, 0)).toBe("NONE");
    expect(medalForWeight(bench, 19.99)).toBe("NONE");
  });

  it("awards each tier exactly at its threshold (PLAN: 20/50/75/100)", () => {
    expect(medalForWeight(bench, 20)).toBe("BRONZE");
    expect(medalForWeight(bench, 50)).toBe("SILVER");
    expect(medalForWeight(bench, 75)).toBe("GOLD");
    expect(medalForWeight(bench, 100)).toBe("PLATINUM");
  });

  it("holds a tier just below the next threshold", () => {
    expect(medalForWeight(bench, 49)).toBe("BRONZE");
    expect(medalForWeight(bench, 74.5)).toBe("SILVER");
    expect(medalForWeight(bench, 99)).toBe("GOLD");
    expect(medalForWeight(bench, 250)).toBe("PLATINUM");
  });

  it("treats a 0kg bronze threshold (bodyweight) as earnable by any set", () => {
    expect(medalForWeight(plank, 0)).toBe("BRONZE");
    expect(medalForWeight(plank, 10)).toBe("SILVER");
    expect(medalForWeight(plank, 30)).toBe("PLATINUM");
  });
});

describe("thresholdFor", () => {
  it("reads the kg for a tier", () => {
    expect(thresholdFor(bench, "BRONZE")).toBe(20);
    expect(thresholdFor(bench, "PLATINUM")).toBe(100);
  });
});

describe("tiersUpTo", () => {
  it("includes every earnable tier up to the current one", () => {
    expect(tiersUpTo("NONE")).toEqual([]);
    expect(tiersUpTo("BRONZE")).toEqual(["BRONZE"]);
    expect(tiersUpTo("GOLD")).toEqual(["BRONZE", "SILVER", "GOLD"]);
    expect(tiersUpTo("PLATINUM")).toEqual(["BRONZE", "SILVER", "GOLD", "PLATINUM"]);
  });
});

describe("nextTier", () => {
  it("points to the next tier with remaining kg", () => {
    expect(nextTier(bench, "NONE", 0)).toEqual({ tier: "BRONZE", kg: 20, remaining: 20 });
    expect(nextTier(bench, "SILVER", 60)).toEqual({ tier: "GOLD", kg: 75, remaining: 15 });
  });

  it("never reports negative remaining", () => {
    expect(nextTier(bench, "SILVER", 80)?.remaining).toBe(0);
  });

  it("returns null at Platinum", () => {
    expect(nextTier(bench, "PLATINUM", 120)).toBeNull();
  });
});

describe("progressToNext", () => {
  it("is 0 at the current floor and 100 at the next threshold", () => {
    expect(progressToNext(bench, "SILVER", 50)).toBe(0);
    expect(progressToNext(bench, "SILVER", 75)).toBe(100);
  });

  it("interpolates between thresholds", () => {
    // halfway from 50 -> 75 is 62.5kg
    expect(progressToNext(bench, "SILVER", 62.5)).toBeCloseTo(50);
  });

  it("is 100 once Platinum is reached", () => {
    expect(progressToNext(bench, "PLATINUM", 100)).toBe(100);
  });
});

describe("newlyEarned", () => {
  it("returns only tiers gained since the previous standing", () => {
    expect(newlyEarned("NONE", "GOLD")).toEqual(["BRONZE", "SILVER", "GOLD"]);
    expect(newlyEarned("SILVER", "GOLD")).toEqual(["GOLD"]);
    expect(newlyEarned("GOLD", "GOLD")).toEqual([]);
  });
});
