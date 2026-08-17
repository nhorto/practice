/**
 * Exercise 03 — Settings events (review)
 *
 * Review of days 2 and 4: rest parameters and the exhaustive switch.
 * Someone added a "reset" event and a `applyAll` helper — and left both
 * half-finished.
 *
 * 🎯 1. `applyAll`'s rest parameter is unannotated — fix it.
 *    2. The switch doesn't handle "reset" (restore DEFAULT_SETTINGS) —
 *       the `never` default is pointing at exactly that. Add the case.
 */
import { expect, expectTypeOf, it } from "vitest";

type Settings = {
  theme: "light" | "dark";
  fontSize: number;
};

const DEFAULT_SETTINGS: Settings = { theme: "light", fontSize: 16 };

type SettingsEvent =
  | { type: "theme-changed"; theme: "light" | "dark" }
  | { type: "font-scaled"; factor: number }
  | { type: "reset" };

const applyEvent = (settings: Settings, event: SettingsEvent): Settings => {
  switch (event.type) {
    case "theme-changed":
      return { ...settings, theme: event.theme };
    case "font-scaled":
      return { ...settings, fontSize: Math.round(settings.fontSize * event.factor) };
    default: {
      const unhandled: never = event;
      throw new Error(`Unhandled event: ${JSON.stringify(unhandled)}`);
    }
  }
};

const applyAll = (settings: Settings, ...events): Settings => {
  return events.reduce(applyEvent, settings);
};

// --- tests ------------------------------------------------------------------

it("applies single events", () => {
  expect(applyEvent(DEFAULT_SETTINGS, { type: "theme-changed", theme: "dark" }))
    .toEqual({ theme: "dark", fontSize: 16 });
  expect(applyEvent(DEFAULT_SETTINGS, { type: "font-scaled", factor: 1.5 }))
    .toEqual({ theme: "light", fontSize: 24 });
});

it("resets to the defaults", () => {
  const custom: Settings = { theme: "dark", fontSize: 24 };
  expect(applyEvent(custom, { type: "reset" })).toEqual(DEFAULT_SETTINGS);
});

it("applies any number of events in order", () => {
  expect(
    applyAll(
      DEFAULT_SETTINGS,
      { type: "theme-changed", theme: "dark" },
      { type: "font-scaled", factor: 2 },
    ),
  ).toEqual({ theme: "dark", fontSize: 32 });
  expect(applyAll(DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
});

it("has the correct types", () => {
  expectTypeOf(applyAll).toEqualTypeOf<
    (settings: Settings, ...events: SettingsEvent[]) => Settings
  >();

  // @ts-expect-error — unknown event types don't compile
  const bad: SettingsEvent = { type: "volume-changed", volume: 11 };
  expect(bad).toBeDefined();
});
