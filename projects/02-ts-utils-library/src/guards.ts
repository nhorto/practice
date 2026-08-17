/**
 * Milestone 3 — type predicates & assertion functions.
 *
 * Note the syntax: assertion functions (`asserts ...`) must be `function`
 * declarations (or explicitly-annotated consts) — an inferred arrow function
 * can't carry an assertion signature.
 */

/**
 * Type predicate: narrows out null/undefined.
 * The killer use case: `values.filter(isDefined)` returns `T[]`, not
 * `(T | undefined)[]`.
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  throw new Error("TODO: milestone 3");
};

/**
 * Exhaustiveness helper: only callable when the compiler has narrowed a value
 * to `never`. Always throws — reaching it at runtime IS a bug.
 */
export const assertNever = (value: never): never => {
  throw new Error(`TODO: milestone 3 (reached with: ${JSON.stringify(value)})`);
};

/**
 * Assertion function: after `invariant(cond, msg)`, the compiler treats
 * `cond` as true. Throws with `msg` when it isn't.
 */
export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  throw new Error("TODO: milestone 3");
}
