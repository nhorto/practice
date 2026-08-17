/**
 * Result shape for the client — same idea you built in project 02.
 *
 * FetchError is a discriminated union: each failure mode carries exactly the
 * data that mode has. (No booleans, no nullable grab-bag fields.)
 */

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export type FetchError =
  | { kind: "network"; url: string; message: string }
  | { kind: "http"; url: string; status: number }
  | { kind: "parse"; url: string; message: string };

export const ok = <T>(value: T): { ok: true; value: T } => ({ ok: true, value });

export const fail = <E>(error: E): { ok: false; error: E } => ({
  ok: false,
  error,
});
