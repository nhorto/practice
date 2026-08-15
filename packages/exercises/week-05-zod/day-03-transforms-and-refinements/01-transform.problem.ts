/**
 * Exercise 01 — .transform()
 *
 * `.transform(fn)` runs after validation and reshapes the value. The schema
 * stops being `unknown → T` and becomes a real pipeline `In → Out`, and zod
 * tracks both sides: `z.input<S>` is what you feed in, `z.output<S>` (which
 * `z.infer` aliases) is what `.parse` returns.
 *
 * 🎯 Two schemas to finish:
 *      - TagListSchema: takes a comma-separated string like "ts, zod ,api"
 *        and outputs trimmed, lowercased, non-empty tags as string[].
 *      - EventSchema: an object with `name: string` and `at`, an ISO
 *        datetime string (z.iso.datetime()) transformed into a `Date`.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: string in, cleaned-up string[] out.
const TagListSchema = z.string();

const EventSchema = z.object({
  name: z.string(),
  // TODO: validate as an ISO datetime string, then transform into a Date.
  at: z.iso.datetime(),
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
