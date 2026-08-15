/**
 * Exercise 02 — Declaring a value TypeScript can't see
 *
 * Sometimes a value exists at runtime that TypeScript knows nothing about —
 * classically a library loaded via a <script> tag that attaches itself to
 * the global object. `declare const` tells the compiler "trust me, this
 * exists at runtime, and here is its type". A `declare` emits no
 * JavaScript — it is a pure compile-time promise, and if you lie, the
 * runtime won't save you.
 *
 * 🎯 Write a `declare const analytics: ...` in the marked spot so the app
 *    code typechecks. Model the shape on the simulated script below:
 *    `track(event)` takes a string and returns a string receipt, and
 *    `pageviews` is a number.
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

// TODO: declare the `analytics` global here.

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
