/**
 * Exercise 02 — Function parameter assignability
 *
 * A function that takes FEWER parameters is assignable where more are
 * expected — the extra arguments are simply ignored at runtime. That's why
 * `array.map((item) => ...)` works even though map also passes an index and
 * the whole array. The reverse is unsafe: a callback demanding MORE
 * parameters would read arguments the caller never passes.
 *
 * 🎯 Annotate `processQueue` so callers may pass a callback that uses the
 *    item, the item + index, or nothing at all — but never one that demands
 *    a third argument.
 */
import { expect, expectTypeOf, it } from "vitest";

const processQueue = (items, onItem) => {
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
