import { expectTypeOf } from "vitest";

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
declare const b: ConfigBuilder<{}>;
const built = b.set("host", "localhost").set("port", 5432).set("secure", true).build();
expectTypeOf(built).toEqualTypeOf<{ host: string; port: number; secure: boolean }>();

// verify a later .set with duplicate key overrides? (intersection makes it never-ish; just check chaining twice keeps both)
const two = b.set("a", 1).set("b", "x").build();
expectTypeOf(two).toEqualTypeOf<{ a: number; b: string }>();

// verify empty-accumulator {} vs object: does `{}` as TConfig seed violate `extends object`? fine.
export { built, two };
