/**
 * Exercise 01 — Branding basics
 *
 * TypeScript is structural: `type UserId = string` and `type PostId = string`
 * are the SAME type, so nothing stops you passing one where the other
 * belongs. A brand — intersecting with a phantom property like
 * `{ readonly __brand: "UserId" }` — makes the alias nominal: only values
 * that went through the constructor function have it. The property never
 * exists at runtime; it lives purely in the type system.
 *
 * 🎯 Brand both aliases:
 *      type UserId = string & { readonly __brand: "UserId" };
 *      type PostId = string & { readonly __brand: "PostId" };
 *    Nothing else changes — the constructors below already assert correctly.
 */
import { expect, expectTypeOf, it } from "vitest";

type UserId = string;
type PostId = string;

// Constructors: the ONE sanctioned door into each branded type.
const userId = (raw: string): UserId => raw as UserId;
const postId = (raw: string): PostId => raw as PostId;

const likePost = (user: UserId, post: PostId): string =>
  `user:${user} liked post:${post}`;

// --- tests ------------------------------------------------------------------

it("likes a post", () => {
  expect(likePost(userId("u1"), postId("p9"))).toBe("user:u1 liked post:p9");
});

it("rejects mixed-up ids at compile time", () => {
  const user = userId("u1");
  const post = postId("p9");
  // @ts-expect-error — arguments are swapped: a PostId is not a UserId
  likePost(post, user);
  // @ts-expect-error — a raw string never went through userId()
  likePost("u1", post);
});

it("still behaves as a plain string at runtime", () => {
  expect(userId("u1").toUpperCase()).toBe("U1");
});

it("keeps the id types distinct", () => {
  expectTypeOf<UserId>().not.toEqualTypeOf<PostId>();
  expectTypeOf<UserId>().not.toEqualTypeOf<string>();
});
