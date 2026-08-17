/**
 * Exercise 01 — .transform() (solution)
 *
 * Validation happens first (`z.string()`, `z.iso.datetime()`), then the
 * transform reshapes the now-trusted value. `z.input` and `z.output` name
 * the two ends of the pipeline — `z.infer` is always the output side.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const TagListSchema = z.string().transform((raw) =>
  raw
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0),
);

const EventSchema = z.object({
  name: z.string(),
  at: z.iso.datetime().transform((iso) => new Date(iso)),
});

// --- tests ------------------------------------------------------------------

it("splits, trims, lowercases, and drops empty tags", () => {
  expect(TagListSchema.parse("ts, Zod ,api,")).toEqual(["ts", "zod", "api"]);
  expect(TagListSchema.parse("solo")).toEqual(["solo"]);
});

it("still validates the input side", () => {
  expect(TagListSchema.safeParse(42).success).toBe(false);
});

it("parses the event timestamp into a Date", () => {
  const event = EventSchema.parse({
    name: "launch",
    at: "2026-08-15T12:00:00Z",
  });
  expect(event.at).toBeInstanceOf(Date);
  expect(event.at.getUTCFullYear()).toBe(2026);
  expect(EventSchema.safeParse({ name: "launch", at: "yesterday" }).success).toBe(
    false,
  );
});

it("input and output types diverge", () => {
  expectTypeOf<z.input<typeof TagListSchema>>().toEqualTypeOf<string>();
  expectTypeOf<z.output<typeof TagListSchema>>().toEqualTypeOf<string[]>();
  expectTypeOf<z.input<typeof EventSchema>>().toEqualTypeOf<{
    name: string;
    at: string;
  }>();
  expectTypeOf<z.output<typeof EventSchema>>().toEqualTypeOf<{
    name: string;
    at: Date;
  }>();
});
