/**
 * Exercise 04 — Combining utility types (solution)
 *
 * `Partial<Omit<Article, "id">>` reads exactly like the rule it encodes:
 * drop `id`, make everything else optional. The spread merge keeps required
 * fields required — optional update fields can't erase them.
 */
import { expect, expectTypeOf, it } from "vitest";

type Article = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  publishedAt: number | null;
};

type ArticleUpdate = Partial<Omit<Article, "id">>;

const applyUpdate = (article: Article, update: ArticleUpdate): Article => {
  return { ...article, ...update };
};

// --- tests ------------------------------------------------------------------

it("derives ArticleUpdate from Article", () => {
  expectTypeOf<ArticleUpdate>().toEqualTypeOf<Partial<Omit<Article, "id">>>();
});

it("applies a partial update without mutating", () => {
  const article: Article = {
    id: "a1",
    title: "Draft",
    body: "…",
    tags: [],
    publishedAt: null,
  };
  const updated = applyUpdate(article, {
    title: "Objects, Deeply",
    publishedAt: 1700000000,
  });
  expect(updated).toEqual({
    id: "a1",
    title: "Objects, Deeply",
    body: "…",
    tags: [],
    publishedAt: 1700000000,
  });
  expect(article.title).toBe("Draft");
});

it("cannot smuggle a new id through an update", () => {
  // @ts-expect-error — `id` is not part of ArticleUpdate
  const bad: ArticleUpdate = { id: "a2" };
  expect(bad).toBeDefined();
});
