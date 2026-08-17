/**
 * Exercise 02 — Mapped types
 *
 * A mapped type loops over the keys of an existing type and builds a new
 * object type: `{ [K in keyof T]: ... }`. Inside the loop, `K` is the
 * current key and `T[K]` is its value type.
 *
 * 🎯 Implement all three with mapped types (no hardcoded keys — they must
 *    work for ANY object type):
 *    - `Flags<T>` — same keys, every value becomes `boolean`
 *    - `Nullable<T>` — same keys, every value may also be `null`
 *    - `MyPartial<T>` — rebuild the built-in `Partial`: every key optional
 */
import { expect, expectTypeOf, it } from "vitest";

type Flags<T> = never; // TODO

type Nullable<T> = never; // TODO

type MyPartial<T> = never; // TODO

// --- tests ------------------------------------------------------------------

type Track = { title: string; plays: number };

it("turns every property into a boolean flag", () => {
  const visible: Flags<Track> = { title: true, plays: false };
  expect(visible.title).toBe(true);
  expectTypeOf<Flags<Track>>().toEqualTypeOf<{ title: boolean; plays: boolean }>();
});

it("lets every value also be null", () => {
  const draft: Nullable<Track> = { title: "Untitled", plays: null };
  expect(draft.plays).toBeNull();
  expectTypeOf<Nullable<Track>>().toEqualTypeOf<{
    title: string | null;
    plays: number | null;
  }>();
});

it("makes every key optional", () => {
  const patch: MyPartial<Track> = { plays: 101 };
  expect(patch.plays).toBe(101);
  expectTypeOf<MyPartial<Track>>().toEqualTypeOf<{
    title?: string;
    plays?: number;
  }>();
});
