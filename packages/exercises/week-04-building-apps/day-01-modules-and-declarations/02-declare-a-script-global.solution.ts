/**
 * Exercise 02 — Declaring a value TypeScript can't see (solution)
 *
 * `declare const` is an ambient declaration: no JavaScript is emitted, it
 * only teaches the compiler about a value the runtime already has. Because
 * this file is a module, the declaration is scoped to this file — in a real
 * app you'd usually put it in a `.d.ts` file (or a `declare global` block)
 * so every module sees it.
 */
import { expect, expectTypeOf, it } from "vitest";

// --- the "script tag" -------------------------------------------------------
// In a real app, <script src="https://cdn.example.com/analytics.js"> would do
// this. TypeScript never sees that file — only the runtime does. This
// assignment plays that role here.
Object.assign(globalThis, {
  analytics: {
    track: (event: string) => `tracked:${event}`,
    pageviews: 0,
  },
});

// --- your declaration -------------------------------------------------------

declare const analytics: {
  track: (event: string) => string;
  pageviews: number;
};

// --- app code ---------------------------------------------------------------

const trackSignup = (plan: string): string => analytics.track(`signup:${plan}`);

const hasTraffic = (): boolean => analytics.pageviews > 0;

// --- tests ------------------------------------------------------------------

it("tracks a signup through the untyped script", () => {
  expect(trackSignup("pro")).toBe("tracked:signup:pro");
});

it("reads pageviews", () => {
  expect(hasTraffic()).toBe(false);
});

it("has the correct types", () => {
  expectTypeOf(trackSignup).toEqualTypeOf<(plan: string) => string>();
  expectTypeOf(hasTraffic).toEqualTypeOf<() => boolean>();
});
