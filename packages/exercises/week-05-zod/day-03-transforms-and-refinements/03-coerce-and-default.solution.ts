/**
 * Exercise 03 — z.coerce.* and .default() (solution)
 *
 * Checks run in chain order: coerce → int → min/max, and `.default` handles
 * the missing-key case before any of that. Note the type split: callers may
 * omit everything (`z.input`), consumers always get the full object
 * (`z.output`).
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["asc", "desc"]).default("asc"),
});

type Pagination = z.output<typeof PaginationSchema>;

// --- tests ------------------------------------------------------------------

it("coerces string query params into numbers", () => {
  expect(PaginationSchema.parse({ page: "3", perPage: "50", sort: "desc" })).toEqual(
    { page: 3, perPage: 50, sort: "desc" },
  );
});

it("fills defaults for missing keys", () => {
  expect(PaginationSchema.parse({})).toEqual({
    page: 1,
    perPage: 20,
    sort: "asc",
  });
});

it("still rejects out-of-range or garbage values", () => {
  expect(PaginationSchema.safeParse({ page: "0" }).success).toBe(false);
  expect(PaginationSchema.safeParse({ perPage: "1000" }).success).toBe(false);
  expect(PaginationSchema.safeParse({ page: "two" }).success).toBe(false);
  expect(PaginationSchema.safeParse({ sort: "sideways" }).success).toBe(false);
});

it("output is fully required even though input is not", () => {
  expectTypeOf<Pagination>().toEqualTypeOf<{
    page: number;
    perPage: number;
    sort: "asc" | "desc";
  }>();
  // Defaults make the input side optional (and coerce accepts unknown):
  expectTypeOf<z.input<typeof PaginationSchema>>().toEqualTypeOf<{
    page?: unknown;
    perPage?: unknown;
    sort?: "asc" | "desc" | undefined;
  }>();
});
