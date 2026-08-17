/**
 * Exercise 04 — Composable API wrappers (solution)
 *
 * Each wrapper stays small and single-purpose; composition does the rest.
 * `ApiResponse<Paginated<User>>` is three reusable pieces snapped together —
 * and `getData` threads `TData` through, so the payload type survives the
 * unwrap with zero casts.
 */
import { expect, expectTypeOf, it } from "vitest";

export type ApiResponse<TData> =
  | { status: "success"; data: TData }
  | { status: "error"; message: string };

export type Paginated<TItem> = {
  items: TItem[];
  page: number;
  totalPages: number;
};

const getData = <TData>(response: ApiResponse<TData>): TData | undefined =>
  response.status === "success" ? response.data : undefined;

// --- tests ------------------------------------------------------------------

type User = { id: number; name: string };

const usersResponse: ApiResponse<Paginated<User>> = {
  status: "success",
  data: { items: [{ id: 1, name: "Ada" }], page: 1, totalPages: 3 },
};

it("nests generics: a paginated response of users", () => {
  const page = getData(usersResponse);
  expectTypeOf(page).toEqualTypeOf<Paginated<User> | undefined>();
  expect(page?.items[0]?.name).toBe("Ada");
  expect(page?.totalPages).toBe(3);
});

it("models failures without touching the payload type", () => {
  const failed: ApiResponse<Paginated<User>> = { status: "error", message: "boom" };
  expect(getData(failed)).toBeUndefined();
});

it("works for any payload", () => {
  const numbers: ApiResponse<number[]> = { status: "success", data: [1, 2, 3] };
  expectTypeOf(getData(numbers)).toEqualTypeOf<number[] | undefined>();
  expect(getData(numbers)).toEqual([1, 2, 3]);
});
