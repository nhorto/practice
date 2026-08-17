/**
 * Exercise 02 — Fluent builder with an accumulating type
 *
 * A fluent builder can do better than "returns some config object": each
 * `.set()` call can ADD the new key/value pair to the type of the chain, so
 * `.build()` returns exactly the keys that were set — no more, no less.
 *
 * Two helpers are provided:
 * - `Prettify<T>` flattens an intersection like `{ a } & { b }` into one
 *   readable object type.
 * - `Widen<T>` turns inferred literals ("localhost", 5432, true) back into
 *   their base types (string, number, boolean).
 *
 * 🎯 Make `ConfigBuilder` generic over the accumulated config so far. `.set()`
 *    must return a builder whose type has grown by `{ [key]: value }`, and
 *    `.build()` must return the accumulated (prettified) object type. The
 *    runtime already works — this is a types-only exercise.
 */
import { expect, expectTypeOf, it } from "vitest";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T;

// TODO: this builder forgets everything — every chain builds the same
// anonymous Record type.
type ConfigBuilder = {
  set(key: string, value: string | number | boolean): ConfigBuilder;
  build(): Record<string, string | number | boolean>;
};

const makeBuilder = (
  entries: [string, string | number | boolean][],
): ConfigBuilder => ({
  set(key, value) {
    return makeBuilder([...entries, [key, value]]);
  },
  build() {
    return Object.fromEntries(entries);
  },
});

const createConfig = (): ConfigBuilder => makeBuilder([]);

// --- tests ------------------------------------------------------------------

it("accumulates keys and value types through the chain", () => {
  const config = createConfig()
    .set("host", "localhost")
    .set("port", 5432)
    .set("secure", true)
    .build();
  expect(config).toEqual({ host: "localhost", port: 5432, secure: true });
  expectTypeOf(config).toEqualTypeOf<{
    host: string;
    port: number;
    secure: boolean;
  }>();
});

it("types every intermediate step", () => {
  const partial = createConfig().set("name", "api").build();
  expectTypeOf(partial).toEqualTypeOf<{ name: string }>();
  // @ts-expect-error `port` was never set on this chain
  partial.port;
});

it("rejects unsupported value types", () => {
  // @ts-expect-error only string | number | boolean values are allowed
  createConfig().set("callback", () => {});
});
