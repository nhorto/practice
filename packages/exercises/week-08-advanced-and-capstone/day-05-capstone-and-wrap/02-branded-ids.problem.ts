/**
 * Exercise 02 — Branded IDs at the boundary (synthesis drill)
 *
 * A UserId and a SessionId are both strings at runtime — and in a big enough
 * codebase somebody WILL pass one where the other belongs. Branding makes
 * them distinct types, and Zod stamps the brand at the parse boundary so a
 * branded value can only be produced by validation.
 *
 * 🎯 1. Implement `Brand<T, TBrand>`: intersect T with a marker object using
 *       the declared unique symbol as its key (`{ readonly [brand]: TBrand }`).
 *    2. Implement `brandedString` so the returned schema's OUTPUT type is the
 *       branded string (`.transform` the validated value, asserting the
 *       brand — the one honest cast in this file).
 *    3. Nothing else should need changes — `startSession` already refuses
 *       mixed-up arguments once the brands are real.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

declare const brand: unique symbol;

// TODO: this "brand" doesn't brand anything — UserId and SessionId collapse
// into plain string, and the compiler can't tell them apart.
type Brand<T, TBrand extends string> = T;

// TODO: make the schema's output type Brand<string, TBrand>.
const brandedString = <TBrand extends string>(schema: z.ZodType<string>) =>
  schema;

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
