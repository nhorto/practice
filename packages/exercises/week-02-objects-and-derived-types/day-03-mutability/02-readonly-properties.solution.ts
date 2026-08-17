/**
 * Exercise 02 — `readonly` properties (solution)
 *
 * Identity fields are `readonly`; the counter stays mutable. Writes to
 * `baseUrl`/`token` are now compile errors — which is exactly what the
 * `@ts-expect-error` lines in the tests assert.
 */
import { expect, expectTypeOf, it } from "vitest";

type ApiClient = {
  readonly baseUrl: string;
  readonly token: string;
  requestCount: number;
};

const createClient = (baseUrl: string, token: string): ApiClient => {
  return { baseUrl, token, requestCount: 0 };
};

const recordRequest = (client: ApiClient): void => {
  client.requestCount += 1;
};

// --- tests ------------------------------------------------------------------

it("creates a client and counts requests", () => {
  const client = createClient("https://api.example.com", "tok_123");
  recordRequest(client);
  recordRequest(client);
  expect(client.requestCount).toBe(2);
  expectTypeOf(client.baseUrl).toEqualTypeOf<string>();
});

it("refuses to overwrite identity fields", () => {
  const client = createClient("https://api.example.com", "tok_123");
  // @ts-expect-error — baseUrl is readonly
  client.baseUrl = "https://evil.example.com";
  // @ts-expect-error — token is readonly
  client.token = "tok_stolen";
  // (readonly is compile-time only — no runtime assertion to make here)
  expect(client.requestCount).toBe(0);
});
