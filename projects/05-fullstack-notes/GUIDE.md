# Project 05 — Full-stack Notes (Next.js + Drizzle + Zod)

**Pairs with:** Week 7 (Drizzle: the typed database)

A notes app with the full typed pipeline:

```
SQLite ──$inferSelect──▶ data layer ──▶ server components
  ▲                                          │
  └── Drizzle insert ◀── Zod-validated ◀── server actions ◀── forms
```

The theme of the week: **one source of truth per layer, everything else
derived.** The Drizzle schema begets the row types (`$inferSelect` /
`$inferInsert`); the Zod schemas validate *toward* those types; the UI only
ever sees data that took that path.

**You write zero CSS.** [`globals.css`](./globals.css) in this folder is the
complete stylesheet — classes: `.site-header`, `.container`, `.page-title`,
`.note-grid` / `.note-grid__empty`, `.note-card` (+ `__title`, `__body`,
`__meta`), `.tag-list` / `.tag`, `.note-form` (+ `__error`, `__actions`),
`.search-form`, `.note-detail` (+ `__title`, `__meta`, `__body`,
`__actions`), `.button--secondary`, `.button--danger`.

No starter package — scaffolding is milestone 1. Reference snippets are given
in fenced code *for you to type out*, never to paste.

---

## Milestone 1 — Scaffold + install the stack

*(week 7, day 1)*

### Goal

A running Next.js App Router app in this folder with Drizzle, better-sqlite3
and Zod installed, styled by the provided `globals.css`.

### Steps

1. From **this folder**:
   ```bash
   pnpm create next-app@latest . --ts --app --no-tailwind --eslint --src-dir=false --import-alias "@/*"
   ```
   Say no to Tailwind (we ship real CSS), yes to App Router. If the prompt
   complains about existing files, let it proceed alongside `GUIDE.md` /
   `globals.css` (or scaffold into a temp dir and move the pieces — one
   minute either way).
2. Rename the package to `"project-fullstack-notes"` in its `package.json`,
   then `pnpm install` from the **repo root** to register it in the
   workspace.
3. Install the data stack (from this folder, or with `--filter`):
   ```bash
   pnpm add drizzle-orm better-sqlite3 zod
   pnpm add -D drizzle-kit @types/better-sqlite3
   ```
   **Native-module gotcha:** better-sqlite3 compiles a native binding, and
   pnpm blocks postinstall scripts by default. The repo root already
   allowlists it (`pnpm.onlyBuiltDependencies` in the root `package.json`),
   but if you ever see `Cannot find module ... better_sqlite3.node`, run
   `pnpm approve-builds` and approve `better-sqlite3`, then reinstall.
4. Replace the generated `app/globals.css` with this folder's `globals.css`.
   Strip `app/page.tsx` to a `.container` + `.page-title` shell, and give
   `app/layout.tsx` a `.site-header` with the app name.
5. Add `notes.db*` and `drizzle/meta` to your mental "generated stuff" list
   (and `.gitignore` if you'd commit — you're not committing here).

### Definition of done

- [ ] `pnpm --filter project-fullstack-notes dev` shows the styled shell.
- [ ] `pnpm --filter project-fullstack-notes exec tsc --noEmit` (or a
      `typecheck` script you add) passes.
- [ ] `node -e "require('better-sqlite3')"`-style smoke test doesn't apply —
      instead: `pnpm approve-builds` shows better-sqlite3 approved/built.

---

## Milestone 2 — Schema, `drizzle.config.ts`, first migration

*(week 7, days 1–2)*

### Goal

A `db/schema.ts` defining `notes` (and later `tags`), a `drizzle.config.ts`,
and a real migration generated + applied by drizzle-kit.

### Types-first approach

The Drizzle schema is *executable DDL that carries types*. Type it out
(reference below — do not paste), then interrogate it in the editor:

```ts
// db/schema.ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
```

Hover `Note` vs `NewNote` and study the difference: `$inferInsert` makes
columns with defaults/autoincrement *optional*. That distinction — "shape of
a row" vs "shape of what you must supply" — is the week's central idea, and
you didn't write either type by hand.

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: "notes.db" },
});
```

### Hints

1. Generate & apply:
   ```bash
   pnpm exec drizzle-kit generate   # writes SQL into ./drizzle
   pnpm exec drizzle-kit migrate    # applies it to notes.db
   ```
   **Read the generated SQL file** — connecting `text("created_at")` to the
   actual `CREATE TABLE` is the point of doing migrations by hand once.
2. Add both as package scripts (`db:generate`, `db:migrate`).
3. `sqlite3 notes.db '.schema'` (or a VS Code SQLite viewer) to confirm.

### Definition of done

- [ ] Migration generated, applied, and *read*.
- [ ] You can explain, from hovers alone, why `NewNote["id"]` is
      `number | undefined` but `Note["id"]` is `number`.

---

## Milestone 3 — The data layer: typed queries, one module

*(week 7, days 2–3)*

### Goal

`db/index.ts` (client) + `db/queries.ts` — the **only** file in the app that
touches Drizzle. Pages and actions import from here, never from `drizzle-orm`
directly.

### Types-first approach

```ts
// db/index.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export const db = drizzle(new Database("notes.db"), { schema });
```

Then a queries module whose *signatures* are the contract:

```ts
export const listNotes = (): Note[] => db.select().from(notes).orderBy(desc(notes.updatedAt)).all();
export const getNote = (id: number): Note | undefined => ...;
export const createNote = (data: NewNote): Note => ...;   // .returning().get()
export const updateNote = (id: number, data: Partial<NewNote>): Note | undefined => ...;
export const deleteNote = (id: number): void => ...;
```

Notice what's *absent*: no hand-written parameter or return types beyond the
derived `Note`/`NewNote`. `Partial<NewNote>` for updates is a utility type
doing real work. "Not found" is `undefined`, not a throw — callers decide
what a missing note means (a 404 page, as it happens).

### Hints

1. better-sqlite3 is synchronous — `.all()` / `.get()` / `.run()`, no
   `await`. Enjoy it; it keeps the layer dead simple.
2. `eq`, `desc`, `like` come from `drizzle-orm` — imported in the queries
   module only.
3. On update, also set `updatedAt`: spread `{ ...data, updatedAt: sql`(datetime('now'))` }`
   or pass the ISO string yourself.
4. Smoke-test the layer without the UI: a `scripts/seed.ts` run with
   `pnpm exec tsx scripts/seed.ts` that creates three notes and lists them.

### Definition of done

- [ ] `queries.ts` compiles with zero hand-written row types.
- [ ] Seed script works; `grep -r "drizzle-orm" app/` finds nothing — the
      boundary holds.

---

## Milestone 4 — Server actions validated with Zod

*(week 7, days 3–4 — the boundaries day)*

### Goal

`app/actions.ts` with `"use server"` actions: `createNoteAction`,
`updateNoteAction`, `deleteNoteAction` — every one parsing its `FormData`
with a Zod schema *aligned to the insert type* before touching the data
layer.

### Types-first approach

A server action's input is **hostile** — it's an HTTP request wearing a
`FormData` costume. So: schema first, and make the compiler verify the schema
matches what the database needs:

```ts
const NoteInputSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required" }).max(200),
  body: z.string().trim().max(10_000).default(""),
}) satisfies z.ZodType<Pick<NewNote, "title" | "body">, ...>;
```

The `satisfies` line is optional ceremony (and its exact spelling in Zod v4
takes a minute to get right) — the *simple* robust pattern is:

```ts
type NoteInput = z.infer<typeof NoteInputSchema>;
// createNote(data: NewNote) — so this line only compiles if the schema output
// actually satisfies the insert type:
const _check: (input: NoteInput) => Note = (input) => createNote(input);
```

Either way, the goal is mechanical: **if the DB schema changes, the Zod
schema is forced to follow.** Wire the drift-detection, don't just hope.

Zod v4 reminders for this file: `{ error: "..." }` for messages;
`z.coerce.number().int().positive()` for the id field coming out of
`FormData` (everything in `FormData` is a string).

### Hints

1. Shape: `async (formData: FormData) => { const parsed = NoteInputSchema.safeParse({ title: formData.get("title"), body: formData.get("body") }); ... }`.
   `formData.get` returns `FormDataEntryValue | null` — Zod's string check
   handles the narrowing for you.
2. On failure, return the field errors (e.g. `z.flattenError(parsed.error)`
   in v4) — pair with `useActionState` in the form for inline `.note-form__error`
   messages. On success, `revalidatePath("/")` and `redirect(...)`.
3. Never trust an id from the client without `z.coerce.number()...` — a
   hand-edited form can send anything.

### Definition of done

- [ ] All three actions parse before they touch `db/queries.ts`; invalid
      input produces a friendly `.note-form__error`, not a 500.
- [ ] Delete a column from the Drizzle schema (temporarily) and confirm the
      type-level check forces a change here. Revert.

---

## Milestone 5 — Pages & components through the data layer

*(week 7, days 4–5)*

### Goal

The UI: `/` lists notes as a `.note-grid` of `.note-card`s with a `.note-form`
to create; `/notes/[id]` shows a `.note-detail` with edit/delete.

### Types-first approach

Server components make the data layer's types flow to JSX with no fetch, no
API route, no serialization layer:

```tsx
// app/page.tsx (server component — async, no "use client")
const notes = listNotes();          // Note[] — hover it
```

- Props of `NoteCard` take a `Note` — the `$inferSelect` type again. When in
  doubt about a prop type in this app, the answer is almost always "the
  derived one, or a `Pick` of it".
- `app/notes/[id]/page.tsx`: in Next 15, `params` is a Promise —
  `const { id } = await params;` — then `z.coerce.number()` the id (route
  params are strings and hostile too!), `getNote(id) ?? notFound()`.
- Client components appear only where interactivity demands them (the form
  with `useActionState`). Everything else stays server-side. Mark the
  boundary consciously with `"use client"` and keep it low in the tree.

### Hints

1. `<form action={createNoteAction}>` works from a server component; you
   only need a client component when you want `useActionState` for inline
   errors.
2. Delete needs a confirm? Keep MVP: a `.button--danger` in a form posting
   to `deleteNoteAction`.
3. Dates: render `createdAt` with `new Date(n.createdAt).toLocaleDateString()`
   inside `.note-card__meta`.

### Definition of done

- [ ] Full CRUD loop in the browser, styled (grid, cards, detail, forms).
- [ ] Invalid create/update shows inline errors without losing input.
- [ ] `tsc --noEmit` clean; no `any` anywhere in `app/` or `db/`.

---

## Milestone 6 — Stretch: search + tags (relations)

*(week 7, day 5 — and overflow time)*

### Goal

A `.search-form` that filters notes server-side, and a `tags` table with a
`noteTags` join table, rendered as `.tag` chips.

### Types-first approach

- **Search**: read `searchParams` in the page (also a Promise in Next 15),
  validate with `z.object({ q: z.string().trim().max(100).optional() })`,
  and add `searchNotes(q: string): Note[]` to the data layer using
  `like(notes.title, `%${q}%`)` + `or(...)` for the body. The URL is a
  boundary; treat it like one.
- **Tags**: two new tables (`tags`, `noteTags` with a composite primary key)
  plus Drizzle **relations** (`relations(notes, ({ many }) => ...)` through
  the join table). Then the relational query API —
  `db.query.notes.findMany({ with: { noteTags: { with: { tag: true } } } })` —
  and hover the result: the nested type materialized from the relations
  definition. Derived types, all the way down.
- New migration: `db:generate` + `db:migrate` again — schema evolution is
  now routine instead of scary.

### Definition of done

- [ ] `/?q=meeting` filters; empty query shows all; junk long queries are
      clamped by the schema.
- [ ] Notes display their tags as `.tag` chips; adding a tag to a note works
      (any UI you like — even a comma-separated input parsed in the action).
- [ ] You can draw the type-flow diagram at the top of this guide from
      memory, labeling which types are derived and from what.
