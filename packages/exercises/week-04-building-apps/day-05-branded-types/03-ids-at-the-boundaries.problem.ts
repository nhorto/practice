/**
 * Exercise 03 — Brands at the boundaries: accounts and money
 *
 * The classic production bug: a function takes three primitives —
 * `(from: string, to: string, amount: number)` — and someone swaps two
 * arguments or passes dollars where cents belong. Brands make every one of
 * those a compile error, and validating constructors keep garbage (negative
 * or fractional cent amounts) out entirely.
 *
 * 🎯 1. Implement `cents`: throw unless `raw` is a non-negative integer,
 *       then brand it. (Invalid money is a programmer error — throwing at
 *       the constructor is the right call.)
 *    2. Implement `dollarsToCents`: convert (watch floating point — round!)
 *       and return via `cents`, not via a bare `as`.
 */
import { expect, expectTypeOf, it } from "vitest";

type AccountId = string & { readonly __brand: "AccountId" };
type Cents = number & { readonly __brand: "Cents" };

const accountId = (raw: string): AccountId => raw as AccountId;

const cents = (raw: number): Cents => {
  // TODO: validate (integer, >= 0) — throw on bad input — then brand.
  return raw;
};

const dollarsToCents = (dollars: number): Cents => {
  // TODO: convert and go through cents().
  return dollars * 100;
};

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
