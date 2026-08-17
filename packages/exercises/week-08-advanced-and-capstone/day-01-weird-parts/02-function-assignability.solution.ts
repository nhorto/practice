/**
 * Exercise 02 — Function parameter assignability (solution)
 *
 * The callback slot is typed `(item: string, index: number) => void`. That is
 * a PROMISE ABOUT WHAT THE CALLER PROVIDES, not a demand on the callee:
 *
 * - `(item) => ...` is assignable: ignoring provided arguments is always safe.
 * - `() => ...` is assignable for the same reason.
 * - `(item, index, extra) => ...` is NOT: it would read a third argument that
 *   processQueue never passes, so TypeScript rejects it.
 *
 * The `=> void` return type has a special rule too: it means "the caller will
 * not use the return value", so callbacks returning anything (like `push`
 * returning a number) are accepted — their result is discarded, not checked.
 */
import { expect, expectTypeOf, it } from "vitest";

const processQueue = (
  items: string[],
  onItem: (item: string, index: number) => void,
) => {
  items.forEach((item, index) => onItem(item, index));
};

// --- tests ------------------------------------------------------------------

it("accepts a callback that only uses the item", () => {
  const seen: string[] = [];
  processQueue(["a", "b", "c"], (item) => {
    seen.push(item.toUpperCase());
  });
  expect(seen).toEqual(["A", "B", "C"]);
});

it("passes the index to callbacks that want it", () => {
  const out: string[] = [];
  processQueue(["x", "y"], (item, index) => {
    out.push(`${index}:${item}`);
  });
  expect(out).toEqual(["0:x", "1:y"]);
});

it("allows a callback that returns a value where void is expected", () => {
  const collected: string[] = [];
  // `push` returns a number — a `=> void` slot accepts it and ignores it.
  processQueue(["ok"], (item) => collected.push(item));
  expect(collected).toEqual(["ok"]);
});

it("has the correct types", () => {
  expectTypeOf(processQueue).parameter(0).toEqualTypeOf<string[]>();
  expectTypeOf(processQueue)
    .parameter(1)
    .toEqualTypeOf<(item: string, index: number) => void>();
  // @ts-expect-error a callback demanding a THIRD argument is rejected — it
  // would read a parameter processQueue never passes.
  processQueue(["a"], (item: string, index: number, extra: boolean) => {
    void extra;
  });
});
