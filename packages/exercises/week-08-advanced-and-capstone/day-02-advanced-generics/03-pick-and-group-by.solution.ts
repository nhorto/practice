/**
 * Exercise 03 — Typed `pick` and `groupBy` (solution)
 *
 * `pick<T extends object, K extends keyof T>`:
 * - `K` is inferred from the ARRAY LITERAL of keys — `["id", "name"]` makes
 *   K = "id" | "name" — and `keys: K[]` simultaneously REJECTS keys that
 *   aren't in the object.
 * - The return type `Pick<T, K>` is computed from both parameters. The
 *   `{} as Pick<T, K>` seed is the usual builder-pattern assertion: the empty
 *   object isn't a Pick YET, but the loop makes it one before it escapes.
 *
 * `groupBy<T, K extends PropertyKey>`:
 * - `T` flows in from the items array, `K` flows from the callback's RETURN
 *   type — infer positions can be anywhere, including inside a function
 *   parameter's return.
 * - When the callback returns a literal union ("todo" | "doing" | "done"),
 *   the result is a finite record and `.done` is `Task[]`. When it returns
 *   plain `string`, the record has an index signature — and
 *   `noUncheckedIndexedAccess` honestly makes lookups `T[] | undefined`.
 * - `(groups[key] ??= [])` initializes a group on first sight; the indexed
 *   read is `T[] | undefined`, which `??=` narrows back to `T[]`.
 */
import { expect, expectTypeOf, it } from "vitest";

const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
};

const groupBy = <T, K extends PropertyKey>(
  items: T[],
  getKey: (item: T) => K,
): Record<K, T[]> => {
  const groups = {} as Record<K, T[]>;
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
