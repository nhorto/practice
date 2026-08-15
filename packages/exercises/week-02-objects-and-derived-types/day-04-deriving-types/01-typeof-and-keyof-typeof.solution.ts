/**
 * Exercise 01 — `typeof` and `keyof typeof` (solution)
 *
 * The object is the single source of truth. Add a setting to
 * `defaultSettings` and both `Settings` and `SettingName` update themselves.
 */
import { expect, expectTypeOf, it } from "vitest";

const defaultSettings = {
  theme: "system",
  fontSize: 14,
  autosave: true,
};

type Settings = typeof defaultSettings;

type SettingName = keyof typeof defaultSettings;

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
