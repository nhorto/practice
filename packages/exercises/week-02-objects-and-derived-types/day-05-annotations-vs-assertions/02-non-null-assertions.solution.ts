/**
 * Exercise 02 — Non-null assertions (solution)
 *
 * Each `!` sits next to a comment stating the invariant that makes it safe.
 * No reason you can write down — no `!`.
 */
import { expect, expectTypeOf, it } from "vitest";

const inventory = new Map<string, number>([
  ["apple", 12],
  ["banana", 5],
]);

const restock = (item: string, amount: number): void => {
  if (inventory.has(item)) {
    // Safe: `has` just confirmed the key exists.
    const current = inventory.get(item)!;
    inventory.set(item, current + amount);
  } else {
    inventory.set(item, amount);
  }
};

const firstWord = (sentence: string): string => {
  // Safe: split(" ") always returns at least one element.
  return sentence.split(" ")[0]!;
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
