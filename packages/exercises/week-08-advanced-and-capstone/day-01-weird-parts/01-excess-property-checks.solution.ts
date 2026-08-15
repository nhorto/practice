/**
 * Exercise 01 — Excess property checks (solution)
 *
 * The rule: excess property checking fires only on FRESH object literals in a
 * position with an expected type (argument, assignment to an annotated
 * variable, return position). `banner`'s typo was caught because the literal
 * was passed directly.
 *
 * `draft`'s typo was NOT caught: by the time `renderChart(draft)` is checked,
 * `draft` is just "a variable whose type has a title and a heigth", and that
 * type is structurally compatible with ChartConfig — extra keys are fine in
 * structural typing. The excess check is a one-shot lint on literals, not a
 * property of the type system.
 *
 * `satisfies ChartConfig` is the fix for intermediate variables: it runs the
 * same strict literal check (catching the typo) WITHOUT widening `draft` to
 * ChartConfig — its inferred type stays `{ title: string; height: number }`.
 */
import { expect, it } from "vitest";

type ChartConfig = {
  title: string;
  width?: number;
  height?: number;
};

const renderChart = (config: ChartConfig): string =>
  `${config.title} (${config.width ?? 640}x${config.height ?? 480})`;

const banner = renderChart({ title: "Revenue", width: 800 });

// `satisfies` re-arms excess property checking for this literal: with the old
// `heigth` typo, this line would now be a compile error.
const draft = { title: "Signups", height: 300 } satisfies ChartConfig;

const signups = renderChart(draft);

// --- tests ------------------------------------------------------------------

it("renders the banner at the requested width", () => {
  expect(banner).toBe("Revenue (800x480)");
});

it("renders signups at the requested height", () => {
  expect(signups).toBe("Signups (640x300)");
});

it("rejects unknown keys on fresh literals", () => {
  // @ts-expect-error `depth` is not part of ChartConfig — the literal is
  // passed directly, so excess property checking fires.
  renderChart({ title: "3D chart", depth: 10 });
});
