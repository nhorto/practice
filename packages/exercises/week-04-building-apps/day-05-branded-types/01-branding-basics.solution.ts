/**
 * Exercise 01 — Branding basics (solution)
 *
 * The brand is a lie the type system tells on your behalf: no runtime value
 * ever has `__brand`, so the only way to obtain a `UserId` is `as`-serting
 * inside the constructor. Different brand literals ⇒ incompatible types,
 * even though both are strings underneath.
 */
import { expect, expectTypeOf, it } from "vitest";

type UserId = string & { readonly __brand: "UserId" };
type PostId = string & { readonly __brand: "PostId" };

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
