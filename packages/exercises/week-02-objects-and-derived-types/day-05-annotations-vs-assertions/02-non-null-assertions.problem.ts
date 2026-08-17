/**
 * Exercise 02 — Non-null assertions (`!`)
 *
 * `!` strips `null | undefined` from a type — by trusting you, not by
 * checking. The rule in this codebase: `!` is allowed only when you can
 * write down WHY the value can't be missing. Both spots below qualify:
 *
 *   - `inventory.get(item)` right after `inventory.has(item)` returned true
 *     — the Map API just can't express that connection.
 *   - `sentence.split(" ")[0]` — split always returns at least one element,
 *     but `noUncheckedIndexedAccess` can't know that.
 *
 * 🎯 Add `!` in both places (keep the comments explaining why it's safe).
 *    If you'd rather narrow with `??`/`if` instead — also fine in real
 *    code, but practice the assertion here.
 */
import { expect, expectTypeOf, it } from "vitest";

const inventory = new Map<string, number>([
  ["apple", 12],
  ["banana", 5],
]);

const restock = (item: string, amount: number): void => {
  if (inventory.has(item)) {
    // Safe: `has` just confirmed the key exists.
    const current = inventory.get(item);
    inventory.set(item, current + amount);
  } else {
    inventory.set(item, amount);
  }
};

const firstWord = (sentence: string): string => {
  // Safe: split(" ") always returns at least one element.
  return sentence.split(" ")[0];
};

// --- tests ------------------------------------------------------------------

it("restocks an existing item", () => {
  restock("apple", 3);
  expect(inventory.get("apple")).toBe(15);
});

it("adds a brand new item", () => {
  restock("cherry", 10);
  expect(inventory.get("cherry")).toBe(10);
});

it("returns the first word as a plain string", () => {
  expect(firstWord("hello brave world")).toBe("hello");
  expect(firstWord("solo")).toBe("solo");
  expectTypeOf(firstWord).toEqualTypeOf<(sentence: string) => string>();
});
