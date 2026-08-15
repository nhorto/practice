/**
 * Milestone 1 — pick / omit.
 *
 * Runtime twins of the built-in `Pick` / `Omit` utility types. As with
 * groupBy: delete the signatures and re-derive them before implementing.
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> => {
  throw new Error("TODO: milestone 1");
};

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> => {
  throw new Error("TODO: milestone 1");
};
