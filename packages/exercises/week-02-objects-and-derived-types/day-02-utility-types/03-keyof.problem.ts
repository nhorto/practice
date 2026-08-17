/**
 * Exercise 03 — `keyof`
 *
 * `keyof Flags` is the union of Flags' property names — always current,
 * never typo'd. The hand-maintained union below has both classic bugs: a
 * misspelled key AND a missing one.
 *
 * 🎯 Replace the hand-written `FlagName` union with `keyof Flags`. Both
 *    compile errors below disappear at once — that's the point.
 */
import { expect, expectTypeOf, it } from "vitest";

type Flags = {
  darkMode: boolean;
  betaFeatures: boolean;
  telemetry: boolean;
};

// Hand-maintained key list: "betaFeature" is a typo, "telemetry" is missing.
type FlagName = "darkMode" | "betaFeature";

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
