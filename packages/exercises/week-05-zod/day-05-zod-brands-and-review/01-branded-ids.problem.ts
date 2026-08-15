/**
 * Exercise 01 — Branded IDs
 *
 * Last week you branded types by hand: `string & { __brand: "UserId" }`,
 * plus a cast at the edge to mint one. Zod folds both steps into the schema:
 * `.brand<"UserId">()` makes `.parse` the only mint, and the parse VALIDATES
 * the format on the way in. Runtime output is unchanged — the brand lives
 * only in the types.
 *
 * 🎯 Brand `UserIdSchema` with `"UserId"` so that:
 *      - a raw string no longer typechecks where a UserId is required
 *        (the @ts-expect-error below starts earning its keep),
 *      - `parseUserId` returns the branded type.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: brand this schema.
const UserIdSchema = z.uuid();

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
