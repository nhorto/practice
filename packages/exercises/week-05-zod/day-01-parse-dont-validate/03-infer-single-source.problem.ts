/**
 * Exercise 03 — z.infer as the single source of truth
 *
 * This file has the classic drift bug: a schema AND a hand-written type for
 * the same data. The schema gained `wordCount` and renamed `author` →
 * `authorName`, but nobody updated the type — so the compiler now disagrees
 * with what `.parse` actually returns. A duplicated type CAN drift;
 * `z.infer<typeof Schema>` CANNOT.
 *
 * 🎯 Delete the hand-written `Article` object type and derive it from
 *    `ArticleSchema` with `z.infer` instead. Don't touch the schema or the
 *    functions.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  authorName: z.string(),
  wordCount: z.number().int(),
  tags: z.array(z.string()),
});

// TODO: this hand-written duplicate has drifted out of sync with the schema.
//       Derive it from ArticleSchema instead.
type Article = {
  slug: string;
  title: string;
  author: string;
  tags: string[];
};

const parseArticle = (data: unknown): Article => ArticleSchema.parse(data);

const readingTime = (article: Article): number => {
  return Math.ceil(article.wordCount / 200);
};

const byline = (article: Article): string => {
  return `${article.title} — ${article.authorName}`;
};

// --- tests ------------------------------------------------------------------

const raw = {
  slug: "parse-dont-validate",
  title: "Parse, Don't Validate",
  authorName: "Alexis King",
  wordCount: 4200,
  tags: ["types", "boundaries"],
};

it("parses an article", () => {
  expect(parseArticle(raw)).toEqual(raw);
});

it("computes reading time from word count", () => {
  expect(readingTime(parseArticle(raw))).toBe(21);
});

it("formats a byline", () => {
  expect(byline(parseArticle(raw))).toBe(
    "Parse, Don't Validate — Alexis King",
  );
});

it("Article stays in sync with the schema", () => {
  expectTypeOf<Article>().toEqualTypeOf<z.infer<typeof ArticleSchema>>();
  expectTypeOf<Article>().toEqualTypeOf<{
    slug: string;
    title: string;
    authorName: string;
    wordCount: number;
    tags: string[];
  }>();
});
