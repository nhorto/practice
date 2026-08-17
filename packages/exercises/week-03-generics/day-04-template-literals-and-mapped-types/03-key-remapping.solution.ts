/**
 * Exercise 03 — Key remapping with `as` (solution)
 *
 * The `as` clause computes each output key from `K`. Template literals +
 * `Capitalize` build the new names; when the `as` clause produces `never`
 * (here via `Exclude`), that key is simply dropped from the result.
 */
import { expect, expectTypeOf, it } from "vitest";

type Getters<T> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K];
};

type OnHandlers<T> = {
  [K in keyof T & string as `on${Capitalize<K>}`]: (value: T[K]) => void;
};

type WithoutMeta<T> = {
  [K in keyof T as Exclude<K, "id" | "createdAt">]: T[K];
};

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
