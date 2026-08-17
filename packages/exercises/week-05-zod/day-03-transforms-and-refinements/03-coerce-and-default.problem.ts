/**
 * Exercise 03 — z.coerce.* and .default()
 *
 * Query strings and env vars deliver everything as strings. `z.coerce.number()`
 * converts before validating ("3000" → 3000, "abc" → NaN → rejected).
 * `.default(value)` fills in a missing (undefined) input — which makes the
 * INPUT side optional while the OUTPUT side stays required. That split shows
 * up in `z.input` vs `z.output`.
 *
 * 🎯 Build `PaginationSchema` for raw query params:
 *      - page:    coerced number, int, min 1, default 1
 *      - perPage: coerced number, int, min 1, max 100, default 20
 *      - sort:    enum "asc" | "desc", default "asc"
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: replace the placeholder fields.
const PaginationSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  sort: z.enum(["asc", "desc"]),
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
