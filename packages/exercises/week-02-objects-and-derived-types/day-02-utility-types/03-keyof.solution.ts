/**
 * Exercise 03 — `keyof` (solution)
 *
 * `keyof Flags` tracks the type automatically: add a flag to `Flags` and
 * `FlagName` grows with it; rename one and every stale usage errors.
 */
import { expect, expectTypeOf, it } from "vitest";

type Flags = {
  darkMode: boolean;
  betaFeatures: boolean;
  telemetry: boolean;
};

type FlagName = keyof Flags;

const toggleFlag = (flags: Flags, name: FlagName): Flags => {
  return { ...flags, [name]: !flags[name] };
};

// --- tests ------------------------------------------------------------------

const defaults: Flags = {
  darkMode: false,
  betaFeatures: false,
  telemetry: true,
};

it("FlagName covers exactly the keys of Flags", () => {
  expectTypeOf<FlagName>().toEqualTypeOf<keyof Flags>();
});

it("toggles any flag by name", () => {
  expect(toggleFlag(defaults, "darkMode").darkMode).toBe(true);
  expect(toggleFlag(defaults, "telemetry").telemetry).toBe(false);
  expect(toggleFlag(defaults, "betaFeatures").betaFeatures).toBe(true);
});

it("rejects names that are not flags", () => {
  // @ts-expect-error — "notAFlag" is not a key of Flags
  toggleFlag(defaults, "notAFlag");
});
