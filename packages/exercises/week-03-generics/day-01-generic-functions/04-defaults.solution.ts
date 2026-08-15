/**
 * Exercise 04 — Type parameter defaults (solution)
 *
 * `createList()` has no argument to infer T from, so without a default it
 * falls back to `unknown`. `<T = string>` picks the fallback; an explicit
 * type argument (`createList<number>()`) still wins.
 *
 * `createRegistry` needs BOTH: the constraint lets the body call `item.id`,
 * and the default keeps zero-argument calls working.
 */
import { expect, expectTypeOf, it } from "vitest";

const createList = <T = string>() => {
  const items: T[] = [];
  return {
    add: (item: T) => {
      items.push(item);
    },
    all: () => [...items],
  };
};

const createRegistry = <T extends { id: string } = { id: string }>() => {
  const byId = new Map<string, T>();
  return {
    register: (item: T) => {
      byId.set(item.id, item);
    },
    get: (id: string) => byId.get(id),
  };
};

// --- tests ------------------------------------------------------------------

it("defaults to a list of strings", () => {
  const tags = createList();
  tags.add("typescript");
  tags.add("generics");
  expect(tags.all()).toEqual(["typescript", "generics"]);
  expectTypeOf(tags.all()).toEqualTypeOf<string[]>();
});

it("still accepts an explicit type argument", () => {
  const scores = createList<number>();
  scores.add(97);
  expect(scores.all()).toEqual([97]);
  expectTypeOf(scores.all()).toEqualTypeOf<number[]>();
  // @ts-expect-error — this list holds numbers
  scores.add("97");
});

type User = { id: string; name: string };

it("registers anything with an id by default", () => {
  const registry = createRegistry();
  registry.register({ id: "u1" });
  expect(registry.get("u1")).toEqual({ id: "u1" });
});

it("accepts a more specific shape", () => {
  const users = createRegistry<User>();
  users.register({ id: "u1", name: "Ada" });
  expect(users.get("u1")?.name).toBe("Ada");
  expectTypeOf(users.get("u1")).toEqualTypeOf<User | undefined>();
});

it("rejects shapes without an id", () => {
  // @ts-expect-error — the constraint requires an id
  createRegistry<{ name: string }>();
});
