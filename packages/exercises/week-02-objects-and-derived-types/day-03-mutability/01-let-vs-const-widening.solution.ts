/**
 * Exercise 01 — `let` vs `const` and widening (solution)
 *
 * `const` keeps the literal `"GET"`. The reassigned `let` gets an explicit
 * `HttpMethod` annotation: every assignment is still checked against the
 * union, but nothing widens to `string`.
 */
import { expect, expectTypeOf, it } from "vitest";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const request = (method: HttpMethod, url: string): string => {
  return `${method} ${url}`;
};

const defaultMethod = "GET";

const buildRequest = (url: string): string => {
  return request(defaultMethod, url);
};

const pickMethod = (hasBody: boolean): string => {
  let method: HttpMethod = "GET";
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
