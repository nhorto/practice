/**
 * Exercise 03 — `satisfies` for configs (solution)
 *
 * `satisfies` validates against `ThemeColors` (a typo'd key or missing
 * `dark` would still error) but the variable keeps its precise inferred
 * type — so `colors.primary` exists, guaranteed, no `undefined`.
 */
import { expect, expectTypeOf, it } from "vitest";

type ThemeColors = Record<string, { light: string; dark: string }>;

const colors = {
  primary: { light: "#4f46e5", dark: "#818cf8" },
  surface: { light: "#ffffff", dark: "#0f172a" },
} satisfies ThemeColors;

const cssVariables = (): Record<string, string> => {
  return {
    "--color-primary": colors.primary.dark,
    "--color-surface": colors.surface.dark,
  };
};

// --- tests ------------------------------------------------------------------

it("keeps the exact keys instead of widening to string", () => {
  expectTypeOf<keyof typeof colors>().toEqualTypeOf<"primary" | "surface">();
  expectTypeOf(colors.primary).toEqualTypeOf<{ light: string; dark: string }>();
});

it("builds css variables from the config", () => {
  expect(cssVariables()).toEqual({
    "--color-primary": "#818cf8",
    "--color-surface": "#0f172a",
  });
});
