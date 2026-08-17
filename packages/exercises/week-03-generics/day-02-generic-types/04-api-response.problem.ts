/**
 * Exercise 04 — Composable API wrappers
 *
 * Every endpoint in an app returns the same envelope — only the payload
 * changes. With `data: unknown` each caller has to cast; a generic parameter
 * makes the envelope reusable AND precise. Generic types also nest:
 * `ApiResponse<Paginated<User>>` reads exactly like what it is.
 *
 * 🎯 1. Make `ApiResponse` generic over its `data` payload.
 *    2. Make `Paginated` generic over its `items` element type.
 *    3. Make `getData` generic so it returns `TData | undefined`.
 */
import { expect, expectTypeOf, it } from "vitest";

export type ApiResponse =
  | { status: "success"; data: unknown }
  | { status: "error"; message: string };

export type Paginated = {
  items: unknown[];
  page: number;
  totalPages: number;
};

const getData = (response: ApiResponse) =>
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
