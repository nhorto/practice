/**
 * Exercise 02 — Excess property checking (and its loophole)
 *
 * TypeScript is structural: extra properties are normally fine. But when you
 * pass a FRESH object literal directly to something expecting a type, the
 * compiler runs *excess property checking* — unknown keys become errors.
 * That's what catches typos in optional properties. The weird part: assign
 * the literal to an intermediate variable first and the check vanishes,
 * because the variable's inferred type simply *has* the extra key.
 *
 * 🎯 1. `salesChart` — the compiler already sees this typo. Fix it.
 *    2. `draft` — the compiler saw nothing, but the render is wrong at
 *       runtime. Annotate `draft` with `: ChartOptions` to bring excess
 *       property checking back, then fix the typo it finds.
 */
import { expect, expectTypeOf, it } from "vitest";

type ChartOptions = {
  title: string;
  showLegend?: boolean;
  lineWidth?: number;
};

const renderChart = (options: ChartOptions): string => {
  const legend = options.showLegend ? " [legend]" : "";
  const width = options.lineWidth ?? 1;
  return `${options.title}${legend} (${width}px)`;
};

// (1) A fresh literal — excess property checking is ON:
const salesChart = renderChart({ title: "Sales", showLegned: true });

// (2) The loophole — an intermediate variable, no annotation, no check:
const draft = { title: "Revenue", lineWidht: 3 };
const revenueChart = renderChart(draft);

// --- tests ------------------------------------------------------------------

it("renders the sales chart with a legend", () => {
  expect(salesChart).toBe("Sales [legend] (1px)");
});

it("renders the revenue chart 3px wide", () => {
  expect(revenueChart).toBe("Revenue (3px)");
});

it("rejects unknown keys in fresh literals", () => {
  // @ts-expect-error — `subtitle` is not part of ChartOptions
  renderChart({ title: "X", subtitle: "nope" });
});

it("has the correct types", () => {
  expectTypeOf(renderChart).parameter(0).toEqualTypeOf<ChartOptions>();
  expectTypeOf(salesChart).toEqualTypeOf<string>();
});
