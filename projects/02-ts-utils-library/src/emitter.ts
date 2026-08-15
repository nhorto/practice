/**
 * Milestone 4 — a typed event emitter.
 *
 * The "event map" pattern: one type parameter describes EVERY event and its
 * payload, and the methods use `K extends keyof TEvents` so each call site is
 * checked against the exact event it names. The Emitter type is given as the
 * contract; the guide asks you to study WHY it's shaped this way, then
 * implement createEmitter.
 */

export type EventMap = Record<string, unknown>;

export type Emitter<TEvents extends EventMap> = {
  /** Subscribe. Returns an unsubscribe function. */
  on: <K extends keyof TEvents>(
    event: K,
    handler: (payload: TEvents[K]) => void,
  ) => () => void;
  /** Emit an event to all current subscribers of that event. */
  emit: <K extends keyof TEvents>(event: K, payload: TEvents[K]) => void;
};

export const createEmitter = <TEvents extends EventMap>(): Emitter<TEvents> => {
  throw new Error("TODO: milestone 4");
};
