/**
 * Exercise 03 — Ambient declarations for bundler-injected constants (solution)
 *
 * `declare const` per constant. Real projects put these in a `globals.d.ts`
 * so the whole app sees them — the declarations here are file-scoped
 * because each exercise file stands alone.
 */
import { expect, expectTypeOf, it } from "vitest";

// --- the "bundler" ----------------------------------------------------------
// A real bundler would textually replace the identifiers at build time. Our
// test runner doesn't bundle, so putting real values on globalThis plays
// that role: an unbound identifier in a module resolves to the global scope
// at runtime.
Object.assign(globalThis, { __APP_VERSION__: "1.4.2", __DEV__: true });

// --- your declarations ------------------------------------------------------

declare const __APP_VERSION__: string;
declare const __DEV__: boolean;

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
