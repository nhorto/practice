/**
 * Exercise 04 — CSS variables from a palette
 *
 * Everything today, combined with week 2's deriving skills: start from ONE
 * `as const` source of truth and derive every other type from it. Add a
 * color to the palette and the variable names, value types, and converter
 * all update — no drift possible.
 *
 * 🎯 1. `PaletteName` — derive the union of color names from `palette`
 *       (don't write the strings out again).
 *    2. `CssVariables` — a mapped type over the palette's keys, remapping
 *       each name `k` to `--color-k`, keeping each EXACT value type.
 *    3. Implement `toCssVariables`. The keys are built at runtime, so
 *       TypeScript can't verify them — finish with `as CssVariables` (an
 *       honest boundary cast, like in exercise 04 yesterday).
 */
import { expect, expectTypeOf, it } from "vitest";

const palette = {
  primary: "#0f62fe",
  danger: "#da1e28",
  success: "#24a148",
} as const;

type PaletteName = string; // TODO — derive it

type CssVariables = never; // TODO — map + remap

const toCssVariables = (colors: typeof palette): CssVariables => {
  // TODO: build { "--color-<name>": value } from the palette entries.
  throw new Error("not implemented");
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
