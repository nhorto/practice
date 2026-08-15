/**
 * Exercise 02 — Fluent builder with an accumulating type (solution)
 *
 * `ConfigBuilder<TConfig>` carries "everything set so far" as a type
 * parameter. The interesting line is `set`'s return type:
 *
 *   ConfigBuilder<TConfig & { [P in K]: Widen<V> }>
 *
 * - `K extends string` captures the literal key ("host"), and the mapped type
 *   `{ [P in K]: ... }` turns it into a real property.
 * - `V` captures the value type. TypeScript infers LITERALS here ("localhost",
 *   5432, true) — `Widen<V>` maps them back to string/number/boolean so the
 *   built config has useful, not over-narrow, types.
 * - Intersecting with `TConfig` is the accumulation: each call stacks one more
 *   `{ key: value }` on the pile, and `build()` returns `Prettify<TConfig>` to
 *   flatten the stack into one readable object type.
 *
 * The single cast in `build()` is the storage-boundary compromise (same story
 * as the event emitter): the runtime entries array can't prove it contains
 * exactly TConfig's keys, so we assert what the chain's types guarantee.
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

type ConfigBuilder<TConfig extends object> = {
  set<K extends string, V extends string | number | boolean>(
    key: K,
    value: V,
  ): ConfigBuilder<TConfig & { [P in K]: Widen<V> }>;
  build(): Prettify<TConfig>;
};

const makeBuilder = <TConfig extends object>(
  entries: [string, string | number | boolean][],
): ConfigBuilder<TConfig> => ({
  set<K extends string, V extends string | number | boolean>(
    key: K,
    value: V,
  ) {
    return makeBuilder<TConfig & { [P in K]: Widen<V> }>([
      ...entries,
      [key, value],
    ]);
  },
  build() {
    return Object.fromEntries(entries) as Prettify<TConfig>;
  },
});

// `{}` is the right seed here (day 1 flashback!): it's the accumulator's
// identity — "no constraints yet" — and every intersection narrows it.
const createConfig = (): ConfigBuilder<{}> => makeBuilder([]);

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
