/**
 * Exercise 03 — `satisfies` for configs
 *
 * Three tools, three trade-offs:
 *   - `as ThemeColors`   — trusts you, catches nothing.
 *   - `: ThemeColors`    — checks, but WIDENS: the compiler forgets which
 *                          keys exist, so every lookup is `... | undefined`.
 *   - `satisfies ThemeColors` — checks the shape AND keeps the precise
 *                          inferred type: exact keys, no undefined.
 *
 * 🎯 Replace the `: ThemeColors` annotation on `colors` with
 *    `satisfies ThemeColors`. The `| undefined` noise in `cssVariables`
 *    disappears, and `keyof typeof colors` becomes the exact key union.
 */
import { expect, expectTypeOf, it } from "vitest";

type ThemeColors = Record<string, { light: string; dark: string }>;

const colors: ThemeColors = {
  primary: { light: "#4f46e5", dark: "#818cf8" },
  surface: { light: "#ffffff", dark: "#0f172a" },
};

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
