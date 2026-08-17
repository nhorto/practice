/**
 * Exercise 03 — Ambient declarations for bundler-injected constants
 *
 * Bundlers can replace identifiers at build time: Vite's `define`, esbuild's
 * `--define`, webpack's DefinePlugin. Your source references `__DEV__` and
 * `__APP_VERSION__`, the bundler swaps in real values, and TypeScript never
 * sees any of it — unless you declare them. This is the same `declare`
 * skill as the previous exercise, applied to build tooling.
 *
 * 🎯 Write ambient declarations for the two constants the "bundler" injects
 *    below: `__APP_VERSION__` is a string, `__DEV__` is a boolean.
 */
import { expect, expectTypeOf, it } from "vitest";

// --- the "bundler" ----------------------------------------------------------
// A real bundler would textually replace the identifiers at build time. Our
// test runner doesn't bundle, so putting real values on globalThis plays
// that role: an unbound identifier in a module resolves to the global scope
// at runtime.
Object.assign(globalThis, { __APP_VERSION__: "1.4.2", __DEV__: true });

// --- your declarations ------------------------------------------------------

// TODO: declare __APP_VERSION__ (a string) and __DEV__ (a boolean).

// --- app code ---------------------------------------------------------------

const versionBanner = (): string => `dojo v${__APP_VERSION__}`;

const debugLog = (message: string): string | undefined =>
  __DEV__ ? `[dev] ${message}` : undefined;

// --- tests ------------------------------------------------------------------

it("builds a version banner", () => {
  expect(versionBanner()).toBe("dojo v1.4.2");
});

it("logs only in dev builds", () => {
  expect(debugLog("boot")).toBe("[dev] boot");
});

it("has the correct types", () => {
  expectTypeOf(versionBanner).toEqualTypeOf<() => string>();
  expectTypeOf(debugLog).toEqualTypeOf<(message: string) => string | undefined>();
});
