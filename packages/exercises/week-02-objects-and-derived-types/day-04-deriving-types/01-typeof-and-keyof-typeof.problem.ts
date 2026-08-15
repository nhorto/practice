/**
 * Exercise 01 — `typeof` and `keyof typeof`
 *
 * The `defaultSettings` object already IS the source of truth — its shape
 * exists at runtime. `typeof defaultSettings` turns that value into a type,
 * and `keyof typeof defaultSettings` gives the union of its keys. The
 * hand-written mirror below has (of course) drifted: one property has the
 * wrong type, and the key union is missing an entry.
 *
 * 🎯 1. `type Settings = typeof defaultSettings;`
 *    2. `type SettingName = keyof typeof defaultSettings;`
 *    Delete the hand-written shapes — deriving fixes both drifts at once.
 */
import { expect, expectTypeOf, it } from "vitest";

const defaultSettings = {
  theme: "system",
  fontSize: 14,
  autosave: true,
};

// Hand-written mirror of defaultSettings — already drifted.
type Settings = {
  theme: string;
  fontSize: string;
  autosave: boolean;
};

// Also hand-maintained — "autosave" never made it in.
type SettingName = "theme" | "fontSize";

const getSetting = (settings: Settings, name: SettingName) => {
  return settings[name];
};

// --- tests ------------------------------------------------------------------

it("derives the type and keys from the runtime object", () => {
  expectTypeOf<Settings>().toEqualTypeOf<typeof defaultSettings>();
  expectTypeOf<SettingName>().toEqualTypeOf<keyof typeof defaultSettings>();
});

it("reads any setting by name", () => {
  expect(getSetting(defaultSettings, "theme")).toBe("system");
  expect(getSetting(defaultSettings, "fontSize")).toBe(14);
  expect(getSetting(defaultSettings, "autosave")).toBe(true);
});

it("rejects names that are not settings", () => {
  // @ts-expect-error — "fontFamily" is not a setting
  getSetting(defaultSettings, "fontFamily");
});
