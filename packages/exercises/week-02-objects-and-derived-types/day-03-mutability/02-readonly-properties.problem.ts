/**
 * Exercise 02 — `readonly` properties
 *
 * `readonly` marks a property as write-once: set it when the object is
 * created, never again. It's a compile-time-only guarantee — free at
 * runtime — and it's how you stop a client's identity fields from being
 * quietly overwritten three modules away.
 *
 * 🎯 Make `baseUrl` and `token` on `ApiClient` `readonly`. Leave
 *    `requestCount` mutable — `recordRequest` legitimately updates it.
 *    (The `@ts-expect-error` lines in the tests are currently "unused"
 *    because nothing stops those writes yet. Your `readonly` makes them
 *    earn their keep.)
 */
import { expect, expectTypeOf, it } from "vitest";

type ApiClient = {
  baseUrl: string;
  token: string;
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
