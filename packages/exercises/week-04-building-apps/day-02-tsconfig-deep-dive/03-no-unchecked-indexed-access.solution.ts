/**
 * Exercise 03 — What `noUncheckedIndexedAccess` catches (solution)
 *
 * Every dynamic index is `T | undefined`, so the empty case gets handled
 * where the data is read: a narrowing check for the medal, `?? 0` for the
 * stock count, `.at(-1)?.trim() ?? fallback` for the last line.
 */
import { expect, expectTypeOf, it } from "vitest";

const MEDALS = ["gold", "silver", "bronze"] as const;

const medalFor = (place: number): string => {
  const medal = MEDALS[place - 1];
  return medal ? `You took ${medal.toUpperCase()}!` : "No medal — great race!";
};

const stock: Record<string, number> = { apple: 12, pear: 3 };

const canBuy = (item: string, quantity: number): boolean =>
  (stock[item] ?? 0) >= quantity;

const lastLine = (lines: string[]): string =>
  lines.at(-1)?.trim() ?? "(empty)";

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
