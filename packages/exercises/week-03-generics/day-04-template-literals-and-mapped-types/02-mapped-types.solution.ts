/**
 * Exercise 02 — Mapped types (solution)
 *
 * Three loops over `keyof T`:
 * - `Flags` replaces every value type wholesale,
 * - `Nullable` builds on the original via `T[K] | null`,
 * - `MyPartial` changes the MODIFIER — the `?` after the key — which is
 *   exactly how the built-in `Partial` is implemented.
 */
import { expect, expectTypeOf, it } from "vitest";

type Flags<T> = { [K in keyof T]: boolean };

type Nullable<T> = { [K in keyof T]: T[K] | null };

type MyPartial<T> = { [K in keyof T]?: T[K] };

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
