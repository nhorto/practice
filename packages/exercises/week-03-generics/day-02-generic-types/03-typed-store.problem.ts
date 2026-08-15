/**
 * Exercise 03 — A typed key-value store
 *
 * This store accepts any string key and hands back `unknown` — every read
 * site needs a cast. Making the FACTORY generic over an object shape `T`
 * (and each METHOD generic over a key `K extends keyof T`) gives every key
 * its own precise value type.
 *
 * 🎯 1. `createStore<T extends Record<string, unknown>>` — generic over the
 *       stored shape, with `data` typed as `Partial<T>`.
 *    2. `set`/`get` each take their own `<K extends keyof T>` so the value
 *       type follows the key.
 */
import { expect, expectTypeOf, it } from "vitest";

const createStore = () => {
  const data: Record<string, unknown> = {};
  return {
    set: (key: string, value: unknown) => {
      data[key] = value;
    },
    get: (key: string) => data[key],
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
