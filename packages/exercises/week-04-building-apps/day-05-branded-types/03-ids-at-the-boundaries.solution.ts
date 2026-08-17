/**
 * Exercise 03 — Brands at the boundaries: accounts and money (solution)
 *
 * `dollarsToCents` never touches `as` — it funnels through `cents`, so
 * there's exactly one place in the file where a number becomes money. If the
 * validation rules ever change, they change once.
 */
import { expect, expectTypeOf, it } from "vitest";

type AccountId = string & { readonly __brand: "AccountId" };
type Cents = number & { readonly __brand: "Cents" };

const accountId = (raw: string): AccountId => raw as AccountId;

const cents = (raw: number): Cents => {
  if (!Number.isInteger(raw) || raw < 0) {
    throw new Error(`Invalid cent amount: ${raw}`);
  }
  return raw as Cents;
};

const dollarsToCents = (dollars: number): Cents => cents(Math.round(dollars * 100));

const transfer = (from: AccountId, to: AccountId, amount: Cents): string =>
  `moved ${amount}¢ from ${from} to ${to}`;

// --- tests ------------------------------------------------------------------

it("converts dollars to cents", () => {
  expect(dollarsToCents(19.99)).toBe(1999);
  // 1.15 * 100 is 114.99999... in floating point — rounding is not optional:
  expect(dollarsToCents(1.15)).toBe(115);
});

it("rejects invalid cent amounts at runtime", () => {
  expect(() => cents(10.5)).toThrow();
  expect(() => cents(-1)).toThrow();
});

it("transfers between accounts", () => {
  expect(transfer(accountId("acc_a"), accountId("acc_b"), dollarsToCents(5))).toBe(
    "moved 500¢ from acc_a to acc_b",
  );
});

it("catches unit and order mixups at compile time", () => {
  // @ts-expect-error — a raw number is not Cents
  transfer(accountId("a"), accountId("b"), 500);
  // @ts-expect-error — an amount can't stand in for an account
  transfer(accountId("a"), dollarsToCents(5), accountId("b"));
});

it("has the correct types", () => {
  expectTypeOf(cents).returns.toEqualTypeOf<Cents>();
  expectTypeOf(dollarsToCents).returns.toEqualTypeOf<Cents>();
  expectTypeOf<Cents>().not.toEqualTypeOf<number>();
});
