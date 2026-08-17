/**
 * Milestone 1 — groupBy.
 *
 * The signature is given so the tests typecheck against the starter, but the
 * guide asks you to DELETE it and re-derive it yourself before implementing —
 * designing the generics is the exercise.
 */
export const groupBy = <T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => K,
): Record<K, T[]> => {
  throw new Error("TODO: milestone 1");
};
