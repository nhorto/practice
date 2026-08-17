/**
 * Exercise 04 — Combining utility types
 *
 * Utility types compose. "An editor may change any field EXCEPT the id"
 * is one line: `Partial<Omit<Article, "id">>` — first drop `id`, then make
 * the rest optional. No hand-written shape, no drift.
 *
 * 🎯 1. Define `ArticleUpdate` by combining `Partial` and `Omit`.
 *    2. Implement `applyUpdate`: merge the update over the article and
 *       return a new object (spread — don't mutate).
 */
import { expect, expectTypeOf, it } from "vitest";

type Article = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  publishedAt: number | null;
};

type ArticleUpdate = unknown; // TODO: any subset of Article's fields, except `id`.

const applyUpdate = (article: Article, update: ArticleUpdate): Article => {
  // TODO: merge `update` over `article`.
  return article;
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
