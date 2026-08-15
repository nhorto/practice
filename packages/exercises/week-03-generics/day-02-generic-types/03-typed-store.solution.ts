/**
 * Exercise 03 — A typed key-value store (solution)
 *
 * Two levels of generics working together:
 * - the FACTORY's `T` fixes the whole shape once (`createStore<Settings>()`),
 * - each METHOD's `K extends keyof T` links a call's key to its value type,
 *   so `set("fontSize", ...)` demands `Settings["fontSize"]` — a number.
 * `Partial<T>` is honest storage: before `set`, a key simply isn't there.
 */
import { expect, expectTypeOf, it } from "vitest";

const createStore = <T extends Record<string, unknown>>() => {
  const data: Partial<T> = {};
  return {
    set: <K extends keyof T>(key: K, value: T[K]) => {
      data[key] = value;
    },
    get: <K extends keyof T>(key: K) => data[key],
  };
};

// --- tests ------------------------------------------------------------------

type Settings = {
  theme: "light" | "dark";
  fontSize: number;
};

it("stores and retrieves values with per-key types", () => {
  const store = createStore<Settings>();
  store.set("theme", "dark");
  store.set("fontSize", 16);
  expect(store.get("theme")).toBe("dark");
  expect(store.get("fontSize")).toBe(16);
  // `| undefined` because the key may not have been set yet
  expectTypeOf(store.get("fontSize")).toEqualTypeOf<number | undefined>();
  expectTypeOf(store.get("theme")).toEqualTypeOf<"light" | "dark" | undefined>();
});

it("returns undefined for keys never set", () => {
  const store = createStore<Settings>();
  expect(store.get("theme")).toBeUndefined();
});

it("rejects wrong value types and unknown keys", () => {
  const store = createStore<Settings>();
  // @ts-expect-error — fontSize holds a number, not a string
  store.set("fontSize", "huge");
  // @ts-expect-error — "volume" is not a key of Settings
  store.get("volume");
});
