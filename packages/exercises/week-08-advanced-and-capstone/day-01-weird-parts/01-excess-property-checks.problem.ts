/**
 * Exercise 01 — Excess property checks
 *
 * TypeScript only checks for unknown ("excess") properties when a FRESH object
 * literal is assigned or passed somewhere with an expected type. A value that
 * goes through an intermediate variable first is compared structurally — extra
 * or misspelled keys slip straight through.
 *
 * 🎯 One call below has a typo that TypeScript caught; another has a typo it
 *    did NOT catch. Fix both, and change `draft` so that TypeScript would have
 *    caught its typo (without adding a type annotation that widens it).
 */
import { expect, it } from "vitest";

type ChartConfig = {
  title: string;
  width?: number;
  height?: number;
};

const renderChart = (config: ChartConfig): string =>
  `${config.title} (${config.width ?? 640}x${config.height ?? 480})`;

// A fresh literal, passed directly — excess property checking fires here.
const banner = renderChart({ title: "Revenue", widht: 800 });

// The same kind of typo — but through a variable, so NO error fires and the
// chart silently renders at the default height.
const draft = { title: "Signups", heigth: 300 };

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
