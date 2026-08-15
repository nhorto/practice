/**
 * Exercise 03 — What `noUncheckedIndexedAccess` catches
 *
 * `strict` alone still lets `array[i]` and `record[key]` pretend to be `T`
 * even when the index is out of bounds or the key is absent. This repo turns
 * on `noUncheckedIndexedAccess`, so every indexed access is `T | undefined`
 * — the type finally matches what JavaScript actually does.
 *
 * 🎯 Fix each body to handle the `undefined` case (the tests define the
 *    fallbacks). Useful moves: a truthiness check, `??` for a default, and
 *    `.at(-1)?.` for "last element, maybe".
 */
import { expect, expectTypeOf, it } from "vitest";

const MEDALS = ["gold", "silver", "bronze"] as const;

const medalFor = (place: number): string => {
  const medal = MEDALS[place - 1];
  return `You took ${medal.toUpperCase()}!`;
};

const stock: Record<string, number> = { apple: 12, pear: 3 };

const canBuy = (item: string, quantity: number): boolean =>
  stock[item] >= quantity;

const lastLine = (lines: string[]): string => lines[lines.length - 1].trim();

// --- tests ------------------------------------------------------------------

it("awards medals for the top three places", () => {
  expect(medalFor(1)).toBe("You took GOLD!");
  expect(medalFor(3)).toBe("You took BRONZE!");
  expect(medalFor(7)).toBe("No medal — great race!");
});

it("treats unknown items as out of stock", () => {
  expect(canBuy("apple", 3)).toBe(true);
  expect(canBuy("pear", 5)).toBe(false);
  expect(canBuy("mango", 1)).toBe(false);
});

it("trims the last line, even of an empty log", () => {
  expect(lastLine(["first ", "  last  "])).toBe("last");
  expect(lastLine([])).toBe("(empty)");
});

it("has the correct types", () => {
  expectTypeOf(medalFor).toEqualTypeOf<(place: number) => string>();
  expectTypeOf(canBuy).toEqualTypeOf<(item: string, quantity: number) => boolean>();
  expectTypeOf(lastLine).toEqualTypeOf<(lines: string[]) => string>();
  // Indexing with a literal the compiler can SEE is still precise:
  expectTypeOf(MEDALS[0]).toEqualTypeOf<"gold">();
});
