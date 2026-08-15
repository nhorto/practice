/**
 * Exercise 03 — Typed `pick` and `groupBy`
 *
 * The `/utils` folder test: utilities whose RETURN TYPE is computed from the
 * arguments. `pick(user, ["id", "name"])` should return exactly
 * `{ id: number; name: string }`, and `groupBy(tasks, t => t.status)` should
 * return a record keyed by the statuses the callback can produce.
 *
 * Right now both utilities are typed like JavaScript with seatbelts off:
 * everything goes in as `object`/`unknown`, everything comes out shapeless.
 *
 * 🎯 Add generics so:
 *    - `pick` only accepts real keys of `obj` and returns `Pick<T, K>`,
 *    - `groupBy` keeps the item type and keys the result by the callback's
 *      return type: `Record<K, T[]>`.
 *    The bodies may need small adjustments once the types are right — no
 *    `any` allowed.
 */
import { expect, expectTypeOf, it } from "vitest";

const pick = (obj: object, keys: string[]) => {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    out[key] = (obj as Record<string, unknown>)[key];
  }
  return out;
};

const groupBy = (items: unknown[], getKey: (item: unknown) => string) => {
  const groups: Record<string, unknown[]> = {};
  for (const item of items) {
    (groups[getKey(item)] ??= []).push(item);
  }
  return groups;
};

// --- tests ------------------------------------------------------------------

type User = { id: number; name: string; email: string; admin: boolean };
const user: User = { id: 1, name: "Ada", email: "ada@example.com", admin: true };

it("picks exactly the requested keys", () => {
  const slim = pick(user, ["id", "name"]);
  expect(slim).toEqual({ id: 1, name: "Ada" });
  expectTypeOf(slim).toEqualTypeOf<{ id: number; name: string }>();
  // @ts-expect-error keys must exist on the object
  pick(user, ["id", "nope"]);
});

type Task = { title: string; status: "todo" | "doing" | "done" };
const tasks: Task[] = [
  { title: "write tests", status: "done" },
  { title: "fix build", status: "doing" },
  { title: "ship", status: "todo" },
  { title: "review PR", status: "done" },
];

it("groups by a derived key", () => {
  const byStatus = groupBy(tasks, (task) => task.status);
  expect(byStatus.done).toHaveLength(2);
  expect(byStatus.todo?.[0]?.title).toBe("ship");
  expectTypeOf(byStatus).toEqualTypeOf<
    Record<"todo" | "doing" | "done", Task[]>
  >();
  expectTypeOf(byStatus.done).toEqualTypeOf<Task[]>();
});

it("keeps the item type inside each group", () => {
  const byInitial = groupBy(["ada", "alan", "grace"], (name) => name[0] ?? "?");
  expect(byInitial.a).toEqual(["ada", "alan"]);
  expectTypeOf(byInitial.g).toEqualTypeOf<string[] | undefined>();
});
