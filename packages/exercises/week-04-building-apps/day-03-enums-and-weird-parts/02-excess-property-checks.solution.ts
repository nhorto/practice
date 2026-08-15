/**
 * Exercise 02 — Excess property checking (and its loophole) (solution)
 *
 * Fresh literals get excess property checking for free. Intermediate
 * variables don't — annotating them (`: ChartOptions`) restores the check.
 * (`satisfies ChartOptions` would work too, and keeps the narrower inferred
 * type — you drilled that in week 2.)
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
const salesChart = renderChart({ title: "Sales", showLegend: true });

// (2) The annotation brings excess property checking to the variable, which
// is what surfaced the `lineWidht` typo:
const draft: ChartOptions = { title: "Revenue", lineWidth: 3 };
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
