import { describe, expect, it } from "vitest";
import { computeStreak } from "@/lib/streak";

// Mon/Wed/Fri schedule. In June 2026, the 8th/10th/12th are Mon/Wed/Fri.
const MWF = [1, 3, 5];

describe("computeStreak — current", () => {
  it("counts every planned day trained this week", () => {
    const r = computeStreak(MWF, ["2026-06-08", "2026-06-10", "2026-06-12"], "2026-06-12");
    expect(r.current).toBe(3);
  });

  it("gives today a grace day when not yet logged", () => {
    // Fri (today) not logged, but Mon+Wed were — streak stays at 2, unbroken.
    const r = computeStreak(MWF, ["2026-06-08", "2026-06-10"], "2026-06-12");
    expect(r.current).toBe(2);
  });

  it("breaks on a missed planned day in the past", () => {
    // Wed missed; only Fri counts before the break.
    const r = computeStreak(MWF, ["2026-06-08", "2026-06-12"], "2026-06-12");
    expect(r.current).toBe(1);
  });

  it("ignores non-planned days (they neither break nor count)", () => {
    // Extra Saturday session doesn't change the streak.
    const r = computeStreak(
      MWF,
      ["2026-06-06", "2026-06-08", "2026-06-10", "2026-06-12"],
      "2026-06-12",
    );
    expect(r.current).toBe(3);
  });

  it("is zero when no training days are set", () => {
    expect(computeStreak([], ["2026-06-12"], "2026-06-12").current).toBe(0);
  });

  it("is zero when the most recent planned day was missed", () => {
    // Today Fri planned but not logged (grace), previous planned Wed also missed -> 0.
    const r = computeStreak(MWF, ["2026-06-08"], "2026-06-12");
    expect(r.current).toBe(0);
  });
});

describe("computeStreak — longest & lastTrainedDate", () => {
  it("tracks the longest historical run across a gap", () => {
    // Week 1: Mon/Wed/Fri all trained (run of 3). Then Mon missed, Wed+Fri trained (run of 2).
    const r = computeStreak(
      MWF,
      ["2026-06-01", "2026-06-03", "2026-06-05", "2026-06-10", "2026-06-12"],
      "2026-06-12",
    );
    expect(r.longest).toBe(3);
    expect(r.current).toBe(2);
  });

  it("reports the latest trained date", () => {
    const r = computeStreak(MWF, ["2026-06-08", "2026-06-12", "2026-06-10"], "2026-06-12");
    expect(r.lastTrainedDate).toBe("2026-06-12");
  });

  it("has a null lastTrainedDate with no sessions", () => {
    expect(computeStreak(MWF, [], "2026-06-12").lastTrainedDate).toBeNull();
  });

  it("never reports a longest shorter than the current streak", () => {
    const r = computeStreak(MWF, ["2026-06-08", "2026-06-10", "2026-06-12"], "2026-06-12");
    expect(r.longest).toBeGreaterThanOrEqual(r.current);
  });
});
