/**
 * Exercise 01 — Branded IDs (solution)
 *
 * One chained call. `z.infer` now yields `string & z.$brand<"UserId">`, so
 * the only way to obtain a `UserId` is through the schema — which also
 * guarantees the uuid format was checked.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const UserIdSchema = z.uuid().brand<"UserId">();

type UserId = z.infer<typeof UserIdSchema>;

const parseUserId = (raw: string): UserId => UserIdSchema.parse(raw);

// Downstream code that must only ever see checked IDs:
const buildProfileUrl = (id: UserId): string => `/users/${id}`;

// --- tests ------------------------------------------------------------------

const rawId = "3f1e9c1a-2b4d-4b6e-9c8a-1d2e3f4a5b6c";

it("parses a valid uuid into a UserId", () => {
  const id = parseUserId(rawId);
  expect(id).toBe(rawId); // brands are free: same string at runtime
  expect(buildProfileUrl(id)).toBe(`/users/${rawId}`);
});

it("rejects a malformed id at the boundary", () => {
  expect(() => parseUserId("user-123")).toThrow();
});

it("a raw string is not a UserId to the compiler", () => {
  // @ts-expect-error — unchecked strings must not pass as UserId
  buildProfileUrl(rawId);
  expectTypeOf<UserId>().not.toEqualTypeOf<string>();
  // ...but a UserId is still a string underneath:
  expectTypeOf<UserId>().toMatchTypeOf<string>();
});
