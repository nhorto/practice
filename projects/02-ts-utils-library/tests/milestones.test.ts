/**
 * Milestone tests for project-ts-utils.
 *
 * Blocks are `describe.skip` because the starter stubs throw
 * ("TODO: milestone N") — remove the `.skip` when you start a milestone.
 * The `expectTypeOf` assertions check at TYPECHECK time (they run even while
 * a block is skipped) — that's deliberate: your signatures must stay honest
 * the whole way through.
 *
 * Milestone 5 (packaging) has no runtime tests — its definition of done lives
 * in GUIDE.md.
 */
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { groupBy } from "../src/group-by";
import { pick, omit } from "../src/object";
import { ok, err, map, unwrapOr, tryCatch, type Result } from "../src/result";
import { isDefined, assertNever, invariant } from "../src/guards";
import { createEmitter } from "../src/emitter";

// ---------------------------------------------------------------------------
// Milestone 0 — starter sanity (already green; leave un-skipped)
// ---------------------------------------------------------------------------
describe("milestone 0 — starter sanity", () => {
  it("exports every utility as a function", () => {
    for (const fn of [groupBy, pick, omit, ok, err, map, unwrapOr, tryCatch, isDefined, assertNever, invariant, createEmitter]) {
      expect(typeof fn).toBe("function");
    }
  });
});

// ---------------------------------------------------------------------------
// Milestone 1 — groupBy + pick/omit with generics
// (skipped: starter stubs throw — remove `.skip` when you start milestone 1)
// ---------------------------------------------------------------------------
describe.skip("milestone 1 — groupBy, pick, omit", () => {
  const people = [
    { name: "Ada", role: "eng" },
    { name: "Grace", role: "eng" },
    { name: "Margaret", role: "pm" },
  ] as const;

  it("groups by a derived key", () => {
    const byRole = groupBy(people, (p) => p.role);
    expect(byRole.eng?.map((p) => p.name)).toEqual(["Ada", "Grace"]);
    expect(byRole.pm?.map((p) => p.name)).toEqual(["Margaret"]);
  });

  it("groupBy infers a literal-keyed record", () => {
    const byRole = groupBy(people, (p) => p.role);
    // Key type inferred as "eng" | "pm" — not string.
    expectTypeOf(byRole).toEqualTypeOf<Record<"eng" | "pm", (typeof people)[number][]>>();
  });

  it("returns an empty record for an empty input", () => {
    expect(groupBy([], (x: { k: string }) => x.k)).toEqual({});
  });

  it("pick keeps only the named keys (and types them)", () => {
    const user = { id: 1, name: "Ada", email: "ada@example.com" };
    const slim = pick(user, ["id", "name"]);
    expect(slim).toEqual({ id: 1, name: "Ada" });
    expectTypeOf(slim).toEqualTypeOf<{ id: number; name: string }>();
  });

  it("omit drops the named keys (and types them)", () => {
    const user = { id: 1, name: "Ada", email: "ada@example.com" };
    const noEmail = omit(user, ["email"]);
    expect(noEmail).toEqual({ id: 1, name: "Ada" });
    expectTypeOf(noEmail).toEqualTypeOf<{ id: number; name: string }>();
  });

  it("pick/omit do not mutate the input", () => {
    const user = { id: 1, name: "Ada" };
    pick(user, ["id"]);
    omit(user, ["id"]);
    expect(user).toEqual({ id: 1, name: "Ada" });
  });
});

// ---------------------------------------------------------------------------
// Milestone 2 — Result<T, E>
// (skipped: remove `.skip` when you start milestone 2)
// ---------------------------------------------------------------------------
describe.skip("milestone 2 — Result", () => {
  it("ok/err build the two variants", () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
    expect(err("boom")).toEqual({ ok: false, error: "boom" });
  });

  it("narrows on the ok discriminant", () => {
    const parseAge = (raw: string): Result<number, string> => {
      const n = Number(raw);
      return Number.isFinite(n) ? ok(n) : err(`not a number: ${raw}`);
    };
    const r = parseAge("2");
    if (r.ok) {
      expectTypeOf(r.value).toEqualTypeOf<number>();
    } else {
      expectTypeOf(r.error).toEqualTypeOf<string>();
    }
    expect(r).toEqual({ ok: true, value: 2 });
  });

  it("map transforms Ok and passes Err through", () => {
    const double = (n: number) => n * 2;
    expect(map(ok(21), double)).toEqual({ ok: true, value: 42 });
    expect(map(err<string>("boom"), double)).toEqual({ ok: false, error: "boom" });
  });

  it("unwrapOr falls back only on Err", () => {
    expect(unwrapOr(ok(7), 0)).toBe(7);
    const failed: Result<number, string> = err("boom");
    expect(unwrapOr(failed, 0)).toBe(0);
  });

  it("tryCatch captures throws as values", () => {
    expect(tryCatch(() => JSON.parse("{\"a\":1}"))).toMatchObject({ ok: true });
    const failed = tryCatch(() => JSON.parse("{nope"));
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.error).toBeInstanceOf(Error);
    }
  });

  it("tryCatch wraps non-Error throws in an Error", () => {
    const failed = tryCatch(() => {
      throw "a string, rudely";
    });
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.error).toBeInstanceOf(Error);
    }
  });
});

// ---------------------------------------------------------------------------
// Milestone 3 — type predicates & assertion functions
// (skipped: remove `.skip` when you start milestone 3)
// ---------------------------------------------------------------------------
describe.skip("milestone 3 — guards", () => {
  it("isDefined narrows in filter", () => {
    const mixed: (number | null | undefined)[] = [1, null, 2, undefined, 3];
    const definite = mixed.filter(isDefined);
    expect(definite).toEqual([1, 2, 3]);
    expectTypeOf(definite).toEqualTypeOf<number[]>();
  });

  it("isDefined keeps falsy-but-defined values", () => {
    expect([0, "", false, null].filter(isDefined)).toEqual([0, "", false]);
  });

  it("assertNever throws when (impossibly) reached", () => {
    expect(() => assertNever("surprise" as never)).toThrow();
  });

  it("invariant throws with the message when the condition fails", () => {
    expect(() => invariant(false, "must not be false")).toThrow(
      "must not be false",
    );
    expect(() => invariant(true, "fine")).not.toThrow();
  });

  it("invariant narrows types after the call", () => {
    const maybe: string | undefined = Math.random() >= 0 ? "hello" : undefined;
    invariant(maybe !== undefined, "expected a string");
    // If invariant's assertion signature works, this line typechecks:
    expectTypeOf(maybe).toEqualTypeOf<string>();
    expect(maybe.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Milestone 4 — typed event emitter
// (skipped: remove `.skip` when you start milestone 4)
// ---------------------------------------------------------------------------
describe.skip("milestone 4 — event emitter", () => {
  type AppEvents = {
    login: { userId: number };
    logout: undefined;
  };

  it("delivers payloads to subscribers of that event only", () => {
    const emitter = createEmitter<AppEvents>();
    const onLogin = vi.fn();
    const onLogout = vi.fn();

    emitter.on("login", onLogin);
    emitter.on("logout", onLogout);
    emitter.emit("login", { userId: 7 });

    expect(onLogin).toHaveBeenCalledWith({ userId: 7 });
    expect(onLogout).not.toHaveBeenCalled();
  });

  it("supports multiple handlers per event", () => {
    const emitter = createEmitter<AppEvents>();
    const a = vi.fn();
    const b = vi.fn();
    emitter.on("login", a);
    emitter.on("login", b);
    emitter.emit("login", { userId: 1 });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("on() returns an unsubscribe function", () => {
    const emitter = createEmitter<AppEvents>();
    const handler = vi.fn();
    const off = emitter.on("login", handler);
    off();
    emitter.emit("login", { userId: 1 });
    expect(handler).not.toHaveBeenCalled();
  });

  it("types payloads per event", () => {
    const emitter = createEmitter<AppEvents>();
    emitter.on("login", (payload) => {
      expectTypeOf(payload).toEqualTypeOf<{ userId: number }>();
    });
    // @ts-expect-error — wrong payload shape for "login"
    emitter.emit("login", { wrong: true });
    // @ts-expect-error — unknown event name
    emitter.emit("signup", undefined);
  });
});
