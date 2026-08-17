# Project 01 — CLI Task Tracker

**Pairs with:** Weeks 1–2 · **Start:** week 1, day 3 · **Finish:** end of week 2

A todo CLI you run with `tsx`: add tasks, list them, complete them, filter and
sort them, and persist everything to a JSON file. No frameworks, no libraries —
just TypeScript, Node, and the style rules.

```bash
pnpm --filter project-cli-task-tracker start       # tsx src/cli.ts
pnpm --filter project-cli-task-tracker test        # vitest run
pnpm --filter project-cli-task-tracker typecheck   # tsc --noEmit
```

**How to work:** open `tests/milestones.test.ts`, find the milestone's
`describe.skip` block, remove the `.skip`, then implement until it's green.
Milestone 0 (starter sanity) is already green — keep it that way.

**Never write `any`.** If the compiler fights you, the answer is `unknown` +
narrowing, or a better type — not a bigger hammer.

---

## Milestone 1 — Model the domain, write the pure core

*(week 1, days 3–5)*

### Goal

`addTask`, `completeTask`, `filterByStatus` in `src/tasks.ts` implemented as
pure functions: tasks in, new tasks out, no mutation, no I/O.

### Types-first approach

The starter already shows the pattern in `src/types.ts` — study it before
writing any logic:

- `TASK_STATUSES` is an `as const` array (runtime value), and `TaskStatus` is
  *derived* from it with indexed access. One source of truth. This is the
  no-enums rule in action: you get the union type AND an iterable list.
- `Task` uses `type`, not `interface` — nothing extends it.
- Function signatures take `readonly Task[]` — the compiler now *enforces*
  "no mutation": `.push()` and `.sort()` on the parameter won't compile.

Before implementing, ask of each function: what does the type signature
already promise? `completeTask` returns `Task[]` even for an unknown id —
"not found" is not an exception in this design, it's a no-op. That's a *type
decision*, and the tests pin it down.

### Hints

1. New id: `tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1` — or spread
   into `Math.max` with a `0` seed.
2. `completeTask` is a `.map()` that returns `{ ...t, status: "done", completedAt: ... }`
   for the matching id and `t` otherwise. Note how object spread gives you
   immutable updates for free.
3. If TypeScript complains that `"done"` is not assignable to `TaskStatus`
   somewhere, you probably let a `string` widen — check where the literal
   travels.
4. `new Date().toISOString()` for timestamps.

### Definition of done

- [ ] `.skip` removed from "milestone 1", all its tests green.
- [ ] `pnpm --filter project-cli-task-tracker typecheck` clean.
- [ ] No `any`, no `as`, no mutation of inputs (grep yourself honest).

---

## Milestone 2 — argv → a discriminated `Command` union

*(week 1 day 4 – week 2 day 1)*

### Goal

`src/parse.ts`: a `Command` union with one variant per command, and
`parseCommand(argv)` that turns `process.argv.slice(2)`-style input into it.
Bad input returns `{ kind: "invalid", reason: string }` — parsing never throws.

### Types-first approach

Design the union FIRST, on paper or in the file, before any parsing logic:

```
add <title>            -> { kind: "add"; title: string }
done <id>              -> { kind: "done"; id: number }     // number, not string!
list [--status s]      -> { kind: "list"; status?: TaskStatus }
help / --help / (none) -> { kind: "help" }
anything else          -> { kind: "invalid"; reason: string }
```

Each variant carries exactly the data that command needs — no optional grab-bag
fields shared across commands. That's "make invalid states unrepresentable":
there is no way to represent "an add command with an id" in this type.

Note `done` carries a `number`. The boundary (argv strings) is where you
convert and validate — the rest of the app never sees a stringly-typed id.

### Hints

1. Start `parseCommand` with `const [cmd, ...rest] = argv;`. Under
   `noUncheckedIndexedAccess`, `cmd` is `string | undefined` — narrowing that
   `undefined` away IS your "no args → help" branch. The compiler is writing
   the spec with you.
2. `Number(rest[0])` + `Number.isInteger(...)` for the id; reject NaN with an
   `invalid` result, don't let it through.
3. For `--status`, you need "is this string one of `TASK_STATUSES`?". Write a
   tiny helper: `const isTaskStatus = (s: string): s is TaskStatus =>
   (TASK_STATUSES as readonly string[]).includes(s);` — your first type
   predicate (week 3 makes these routine).
4. Multi-word titles: `rest.join(" ")`, but an empty join means `add` with no
   title → invalid.

### Definition of done

- [ ] `.skip` removed from "milestone 2", all tests green; typecheck clean.
- [ ] `Command` is a discriminated union on `kind`; hovering `parseCommand`'s
      return type in your editor shows all five variants.
- [ ] Inside an `if (command.kind === "add")` block, your editor autocompletes
      `command.title` and rejects `command.id`. Try it.

---

## Milestone 3 — JSON persistence with hand-rolled narrowing

*(week 2, days 1–3 — after the `unknown` and narrowing drills)*

### Goal

`src/storage.ts`: `saveTasks` / `loadTasks` against a JSON file, plus an
`isTask` type guard that validates every entry on load. This is the pre-Zod
week: you ARE the schema.

### Types-first approach

`JSON.parse` returns `any` — the most dangerous value in TypeScript.
Quarantine it immediately:

```ts
const raw: unknown = JSON.parse(text);
```

From `unknown`, nothing is accessible until you prove a shape. That proof is
`isTask(value: unknown): value is Task` — a function whose *return type* is an
assertion the compiler trusts. Inside it, check:

- `typeof value === "object" && value !== null`
- each property's `typeof` (`id` number, `title` string, ...)
- `status` is in `TASK_STATUSES` (reuse milestone 2's `isTaskStatus`)
- `completedAt` is `undefined` OR a string (optional ≠ ignorable)

The contract (pinned by tests): missing file → `[]`; array with junk entries →
junk dropped via `.filter(isTask)`. Note the payoff: `unknown[].filter(isTask)`
returns `Task[]` — the predicate does the type-level work.

### Hints

1. `readFileSync(path, "utf8")` inside `try/catch` — the catch is your
   "missing file" branch. (A missing file is *expected*, so a value (`[]`) not
   a throw. A disk full of garbage on *save* is a bug — let that throw.)
2. To check properties on an `object`-typed value you need the `in` operator:
   `"id" in value` narrows, then `typeof (value as ...)`... no — avoid `as`.
   Cleaner: accept `Record<string, unknown>` via a small helper
   `isRecord(v: unknown): v is Record<string, unknown>`, then check
   `typeof v.id === "number"` directly. Two tiny guards compose.
3. `Array.isArray(raw)` narrows `unknown` to `unknown[]`. If it's not an
   array, return `[]`.
4. `JSON.stringify(tasks, null, 2)` — pretty-print so you can inspect
   `tasks.json` by eye while debugging.

### Definition of done

- [ ] `.skip` removed from "milestone 3", all tests green; typecheck clean.
- [ ] `isTask` contains zero `as` casts.
- [ ] Manually corrupt a `tasks.json` (add `"garbage"` to the array) and
      confirm the CLI survives once wired up (or via the tests for now).

---

## Milestone 4 — Filtering & sorting with derived types

*(week 2, days 3–4 — the `typeof`/`keyof`/deriving day)*

### Goal

`sortTasks(tasks, key)` in `src/tasks.ts`, where `SortKey` is **derived** from
`Task` instead of hand-maintained.

### Types-first approach

The starter placeholder hand-writes `type SortKey = "createdAt" | "title"`.
That's a duplication bug waiting to happen: rename a Task field and `SortKey`
silently rots. Replace it with a value-first derivation:

```ts
export const SORT_KEYS = ["createdAt", "title", "status"] as const
  satisfies readonly (keyof Task)[];
export type SortKey = (typeof SORT_KEYS)[number];
```

Read that twice — it's three curriculum days in two lines:

- `as const` keeps the literal types (`"title"`, not `string`).
- `satisfies readonly (keyof Task)[]` *validates* every entry is a real Task
  key **without widening** the type. Typo `"titel"` → compile error.
- `(typeof SORT_KEYS)[number]` derives the union. One source of truth, again —
  and the CLI can print valid sort keys at runtime because the list exists as
  a value.

### Hints

1. Copy first, sort second: `[...tasks].sort(...)` — `readonly Task[]` won't
   even let you call `.sort()` directly, which is the point.
2. `String(a[key]).localeCompare(String(b[key]))` covers all three keys since
   ISO timestamps sort lexicographically. (Indexed access `a[key]` typechecks
   because `key` is a `keyof Task` subset — that's the derivation paying off.)
3. Stretch: extend `parseCommand`'s `list` variant with an optional
   `sort?: SortKey` (`list --sort title`) and add your own test for it.

### Definition of done

- [ ] `.skip` removed from "milestone 4", tests green; typecheck clean.
- [ ] `SortKey` no longer hand-written — delete a key from `SORT_KEYS` and
      watch dependent code light up; then restore it.

---

## Milestone 5 — Wire the CLI: exhaustive switch, help, errors as values

*(week 2, days 4–5)*

### Goal

`runCommand` in `src/run.ts` implemented with an exhaustive `switch`, and
`src/cli.ts` rewired to the full pipeline:
`loadTasks → parseCommand → runCommand → saveTasks → print`.

### Types-first approach

`runCommand(tasks, command): { tasks; output }` — a pure function, so the whole
app is testable without a filesystem. The `switch (command.kind)` must be
*exhaustive*:

```ts
default: {
  const unreachable: never = command;
  throw new Error(`Unhandled command: ${JSON.stringify(unreachable)}`);
}
```

If every variant is handled, `command` has type `never` in `default` and this
compiles. Add a sixth `Command` variant later and this line — plus nothing
else — turns red. The compiler now maintains your TODO list.

Second design rule: `invalid` input flows through as a *value* — `runCommand`
turns it into friendly output and unchanged state. `throw` is reserved for
actual bugs (like the `never` branch above).

### Hints

1. Each `case` mostly delegates to a milestone-1/4 function and formats a
   string. Keep formatting in small helpers (`formatTask(t): string`).
2. In `cli.ts`: read an optional `TASKS_FILE` env var falling back to
   `DEFAULT_DB_PATH`, and only `saveTasks` when the command actually changed
   state (compare references — pure functions make that trivial: unchanged
   commands can return the same array).
3. Set `process.exitCode = 1` for `invalid` — CLIs speak exit codes.
4. Try it for real: `pnpm --filter project-cli-task-tracker start add "ship milestone 5"`.

### Definition of done

- [ ] All five milestone blocks un-skipped and green; typecheck clean.
- [ ] The `never` exhaustiveness check is in place — temporarily add a fake
      variant to `Command` and confirm the compile error, then remove it.
- [ ] Full demo from the shell: add two tasks, `list`, `done 1`,
      `list --status done`, `list --status banana` (friendly error, exit 1).

---

## Done with the project?

Compare your design against the style-rules list in
[projects/README.md](../README.md) — every rule should have shown up at least
once. Week 3 starts generics, where project 02 turns these patterns into a
reusable library.
