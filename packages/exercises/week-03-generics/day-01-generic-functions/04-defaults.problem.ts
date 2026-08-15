/**
 * Exercise 04 — Type parameter defaults
 *
 * When a generic function has NO argument to infer from — like a factory that
 * takes nothing — `T` falls back to `unknown`. A default (`<T = string>`)
 * picks the fallback yourself, and it composes with a constraint:
 * `<T extends Base = Base>`.
 *
 * 🎯 1. Give `createList`'s type parameter a default of `string`.
 *    2. Constrain `createRegistry`'s type parameter to `{ id: string }` AND
 *       default it to that same shape.
 */
import { expect, expectTypeOf, it } from "vitest";

const createList = <T>() => {
  const items: T[] = [];
  return {
    add: (item: T) => {
      items.push(item);
    },
    all: () => [...items],
  };
};

const createRegistry = <T>() => {
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
