/**
 * Exercise 03 — Key remapping with `as`
 *
 * A mapped type can RENAME keys while it loops: `[K in keyof T as NewName]`.
 * Combine that with a template literal (`` `get${Capitalize<K>}` ``) to
 * derive whole APIs from a data shape — and remap a key to `never` to drop
 * it entirely.
 *
 * (`keyof T & string` keeps only the string keys, so K can be used inside a
 * template literal.)
 *
 * 🎯 Implement with mapped types + `as`:
 *    - `Getters<T>` — every key `k` becomes `getK`, a function returning `T[k]`
 *    - `OnHandlers<T>` — every key `k` becomes `onK`, `(value: T[k]) => void`
 *    - `WithoutMeta<T>` — same shape, minus the `"id"` and `"createdAt"` keys
 *      (remap them to `never` via `Exclude`)
 */
import { expect, expectTypeOf, it } from "vitest";

type Getters<T> = never; // TODO

type OnHandlers<T> = never; // TODO

type WithoutMeta<T> = never; // TODO

// --- tests ------------------------------------------------------------------

type Article = { title: string; likes: number };

it("derives getter names from keys", () => {
  const articleGetters: Getters<Article> = {
    getTitle: () => "Generics in practice",
    getLikes: () => 42,
  };
  expect(articleGetters.getTitle()).toBe("Generics in practice");
  expectTypeOf<Getters<Article>>().toEqualTypeOf<{
    getTitle: () => string;
    getLikes: () => number;
  }>();
});

it("derives handler signatures from keys", () => {
  expectTypeOf<OnHandlers<Article>>().toEqualTypeOf<{
    onTitle: (value: string) => void;
    onLikes: (value: number) => void;
  }>();
});

type DbRow = { id: string; createdAt: string; title: string; body: string };

it("drops meta keys", () => {
  expectTypeOf<WithoutMeta<DbRow>>().toEqualTypeOf<{
    title: string;
    body: string;
  }>();
});
