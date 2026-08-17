/**
 * Exercise 04 — CSS variables from a palette (solution)
 *
 * One value is the source of truth; the types are all derived:
 * - `keyof typeof palette` — the names
 * - the mapped type remaps each name through a template literal and reads
 *   the exact value type back out with an indexed access
 * The runtime side builds keys dynamically, which TypeScript can't follow —
 * so the function checks its inputs precisely and asserts once, at the end.
 */
import { expect, expectTypeOf, it } from "vitest";

const palette = {
  primary: "#0f62fe",
  danger: "#da1e28",
  success: "#24a148",
} as const;

type PaletteName = keyof typeof palette;

type CssVariables = {
  [K in PaletteName as `--color-${K}`]: (typeof palette)[K];
};

const toCssVariables = (colors: typeof palette): CssVariables => {
  const entries = Object.entries(colors).map(([name, value]) => [
    `--color-${name}`,
    value,
  ]);
  return Object.fromEntries(entries) as CssVariables;
};

// --- tests ------------------------------------------------------------------

it("derives the palette names", () => {
  expectTypeOf<PaletteName>().toEqualTypeOf<"primary" | "danger" | "success">();
});

it("derives css variable names and exact values", () => {
  expectTypeOf<CssVariables>().toEqualTypeOf<{
    "--color-primary": "#0f62fe";
    "--color-danger": "#da1e28";
    "--color-success": "#24a148";
  }>();
});

it("converts the palette at runtime", () => {
  expect(toCssVariables(palette)).toEqual({
    "--color-primary": "#0f62fe",
    "--color-danger": "#da1e28",
    "--color-success": "#24a148",
  });
});
