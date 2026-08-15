/**
 * Exercise 01 — Template literal types (solution)
 *
 * `` `/${string}` `` reads like the strings it accepts. And because unions
 * DISTRIBUTE inside template literals, `` `${Variant}-${Size}` `` is all
 * four combinations — add a variant later and every combination updates
 * itself.
 */
import { expect, expectTypeOf, it } from "vitest";

type Route = `/${string}`;

type HexColor = `#${string}`;

type Variant = "primary" | "danger";
type Size = "sm" | "lg";
type ButtonClass = `${Variant}-${Size}`;

const navigate = (route: Route) => `navigating to ${route}`;

// --- tests ------------------------------------------------------------------

it("only accepts absolute routes", () => {
  expect(navigate("/settings")).toBe("navigating to /settings");
  // @ts-expect-error — routes must start with a slash
  navigate("settings");
});

it("accepts any suffix after the required prefix", () => {
  const accent: HexColor = "#663399";
  expect(accent.startsWith("#")).toBe(true);
  // @ts-expect-error — missing the #
  const wrong: HexColor = "663399";
  expect(wrong).toBe("663399");
});

it("expands unions into every combination", () => {
  const classes: ButtonClass[] = ["primary-sm", "primary-lg", "danger-sm", "danger-lg"];
  expect(classes).toHaveLength(4);
  expectTypeOf<ButtonClass>().toEqualTypeOf<
    "primary-sm" | "primary-lg" | "danger-sm" | "danger-lg"
  >();
  // @ts-expect-error — "xl" is not a Size
  const invalid: ButtonClass = "danger-xl";
  expect(invalid).toBe("danger-xl");
});
