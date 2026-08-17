/**
 * Exercise 02 — Branded IDs at the boundary (solution)
 *
 * `Brand<T, TBrand>` intersects the runtime type with a PHANTOM marker:
 * `{ readonly [brand]: TBrand }`. Because `brand` is a `declare`d unique
 * symbol, no real object ever has that property — the marker exists only in
 * the type system, which is exactly the point:
 *
 * - `UserId` and `SessionId` differ in their marker, so they're mutually
 *   unassignable — swapped arguments are a compile error.
 * - A plain string lacks the marker entirely, so raw strings can't sneak in.
 * - `UserId` is still `string & ...`, so it flows OUT to string positions
 *   freely — you only pay at construction, never at use.
 *
 * `brandedString` puts construction where it belongs: behind validation.
 * `.transform((value) => value as Brand<string, TBrand>)` upgrades the
 * schema's output type; the `as` is the single honest cast — justified
 * because the brand is unforgeable any other way, and the value just passed
 * validation. Callers only ever meet branded values that earned it.
 * (Zod ships `.brand<"...">()` for exactly this pattern — now you know what
 * it does under the hood.)
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

declare const brand: unique symbol;

type Brand<T, TBrand extends string> = T & { readonly [brand]: TBrand };

const brandedString = <TBrand extends string>(schema: z.ZodType<string>) =>
  schema.transform((value) => value as Brand<string, TBrand>);

type UserId = Brand<string, "UserId">;
type SessionId = Brand<string, "SessionId">;

const userIdSchema = brandedString<"UserId">(z.uuid());
const sessionIdSchema = brandedString<"SessionId">(z.uuid());

const sessions = new Map<SessionId, UserId>();

const startSession = (sessionId: SessionId, userId: UserId) => {
  sessions.set(sessionId, userId);
};

// --- tests ------------------------------------------------------------------

const RAW_USER_ID = "0f8fad5b-d9cb-469f-a165-70867728950e";
const RAW_SESSION_ID = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

it("brands are distinct from each other and from string", () => {
  expectTypeOf<UserId>().not.toEqualTypeOf<string>();
  expectTypeOf<UserId>().not.toEqualTypeOf<SessionId>();
  const userId = userIdSchema.parse(RAW_USER_ID);
  expectTypeOf(userId).toEqualTypeOf<UserId>();
  // ...but a branded id is still a string underneath:
  const plain: string = userId;
  expect(plain).toBe(RAW_USER_ID);
});

it("refuses to mix up id types", () => {
  sessions.clear();
  const userId = userIdSchema.parse(RAW_USER_ID);
  const sessionId = sessionIdSchema.parse(RAW_SESSION_ID);
  startSession(sessionId, userId);
  // @ts-expect-error arguments swapped — the brands catch it
  startSession(userId, sessionId);
  // @ts-expect-error a raw string never carries a brand
  startSession(sessionId, RAW_USER_ID);
  expect(sessions.get(sessionId)).toBe(userId);
});

it("validates at the boundary", () => {
  expect(() => userIdSchema.parse("not-a-uuid")).toThrow();
});
