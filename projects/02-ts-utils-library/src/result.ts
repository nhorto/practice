/**
 * Milestone 2 — Result<T, E>: errors as values.
 *
 * The type is given (project 03 depends on the same shape); the functions are
 * yours to implement.
 */

export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

/** Wrap a success value. */
export const ok = <T>(value: T): Ok<T> => {
  throw new Error("TODO: milestone 2");
};

/** Wrap a failure value. */
export const err = <E>(error: E): Err<E> => {
  throw new Error("TODO: milestone 2");
};

/** Transform the success value; pass an Err through untouched. */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => {
  throw new Error("TODO: milestone 2");
};

/** Get the value, or `fallback` if this is an Err. */
export const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T => {
  throw new Error("TODO: milestone 2");
};

/**
 * Run a throwing function and capture the outcome as a Result.
 * Anything thrown that isn't an Error gets wrapped in one.
 */
export const tryCatch = <T>(fn: () => T): Result<T, Error> => {
  throw new Error("TODO: milestone 2");
};
