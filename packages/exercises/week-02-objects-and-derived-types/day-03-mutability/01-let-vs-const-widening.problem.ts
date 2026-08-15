/**
 * Exercise 01 — `let` vs `const` and widening
 *
 * `const defaultMethod = "GET"` infers the literal type `"GET"` — the value
 * can never change, so the type can be exact. `let` promises reassignment,
 * so TypeScript WIDENS the inference to `string`… and `string` is not
 * assignable to a union of specific methods.
 *
 * 🎯 Two different fixes:
 *    1. `defaultMethod` is never reassigned — make it a `const` and let
 *       inference keep the literal type.
 *    2. `pickMethod`'s local IS genuinely reassigned — keep the `let`, but
 *       annotate it with `HttpMethod` so it never widens to `string`.
 */
import { expect, expectTypeOf, it } from "vitest";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const request = (method: HttpMethod, url: string): string => {
  return `${method} ${url}`;
};

let defaultMethod = "GET";

const buildRequest = (url: string): string => {
  return request(defaultMethod, url);
};

const pickMethod = (hasBody: boolean): string => {
  let method = "GET";
  if (hasBody) {
    method = "POST";
  }
  return request(method, "/api/users");
};

// --- tests ------------------------------------------------------------------

it("builds a GET request by default", () => {
  expect(buildRequest("/api/users")).toBe("GET /api/users");
});

it("switches to POST when there is a body", () => {
  expect(pickMethod(true)).toBe("POST /api/users");
  expect(pickMethod(false)).toBe("GET /api/users");
});

it("keeps the literal type on the const", () => {
  expectTypeOf<typeof defaultMethod>().toEqualTypeOf<"GET">();
});
