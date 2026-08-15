/**
 * Exercise 02 — Object and array types
 *
 * 🎯 Replace every `unknown` below with the correct type so all tests and
 *    type checks pass.
 *
 * Things to reach for:
 *   - object shapes:        { title: string; pages: number }
 *   - optional properties:  { nickname?: string }
 *   - arrays:               string[]  (or Array<string>)
 *   - arrays of objects:    { id: number }[]
 */
import { expect, expectTypeOf, it } from "vitest";

const formatBook = (book: unknown) => {
  return `${book.title} (${book.pages} pages)`;
};

const totalPages = (books: unknown) => {
  return books.reduce((sum, book) => sum + book.pages, 0);
};

// `middleName` is optional — some people don't have one.
const fullName = (person: unknown) => {
  return [person.first, person.middleName, person.last]
    .filter((part) => part !== undefined)
    .join(" ");
};

// --- tests ------------------------------------------------------------------

it("formats a book", () => {
  expect(formatBook({ title: "Total TypeScript", pages: 380 })).toBe(
    "Total TypeScript (380 pages)",
  );
});

it("sums pages across books", () => {
  expect(
    totalPages([
      { title: "A", pages: 100 },
      { title: "B", pages: 150 },
    ]),
  ).toBe(250);
});

it("handles an optional middle name", () => {
  expect(fullName({ first: "Ada", last: "Lovelace" })).toBe("Ada Lovelace");
  expect(fullName({ first: "George", middleName: "Gordon", last: "Byron" })).toBe(
    "George Gordon Byron",
  );
});

it("has the correct types", () => {
  expectTypeOf(formatBook).parameter(0).toEqualTypeOf<{
    title: string;
    pages: number;
  }>();
  expectTypeOf(totalPages).parameter(0).toEqualTypeOf<
    { title: string; pages: number }[]
  >();
  expectTypeOf(fullName).parameter(0).toEqualTypeOf<{
    first: string;
    middleName?: string;
    last: string;
  }>();
});
