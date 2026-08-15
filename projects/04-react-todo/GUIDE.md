# Project 04 — React Todo (Vite + React + TypeScript)

**Pairs with:** Week 6 (React + TypeScript patterns)

A todo app where *all* the effort goes into types and logic — reducer with a
discriminated `Action` union, typed props and events, a Zod-validated
`localStorage` hook.

**You write zero CSS.** This folder ships a finished
[`styles.css`](./styles.css) with every class name the guide uses (`.app`,
`.todo-form`, `.filters` / `.filter--active`, `.todo-list`, `.todo-item` /
`.todo-item--done`, `.todo-item__title`, `.todo-item__delete`,
`.app__footer`, `.app__clear-done`, …). In milestone 1 you copy it in; from
then on, styling a component = putting the right class name on the right
element.

There is no starter package — **scaffolding the app is milestone 1** — and no
vitest suite; the "tests" are your eyes, the compiler, and each milestone's
definition of done. Keep the no-`any` rule; in React that especially means:
no `React.FC`, no `as` to silence event types, no `any` in props.

---

## Milestone 1 — Scaffold with Vite

*(week 6, day 1)*

### Goal

A running React + TS dev server inside this folder, wired into the pnpm
workspace, with the provided stylesheet applied.

### Types-first approach

Nothing to design yet — but plenty to *read*. After scaffolding, open the
generated `tsconfig.app.json` and compare against the repo's
`tsconfig.base.json`: you'll recognize `strict`, `moduleResolution: "bundler"`,
`verbatimModuleSyntax`... and meet `"jsx": "react-jsx"`, which is why you
never `import React` just to write JSX.

### Steps

1. From **this folder** (`projects/04-react-todo/`):
   ```bash
   pnpm create vite@latest . --template react-ts
   ```
   (The `.` scaffolds in place; confirm when it asks about the non-empty
   directory — it will leave `GUIDE.md`/`styles.css` alone, or choose the
   "ignore files and continue" option.)
2. In the generated `package.json`, change `"name"` to
   `"project-react-todo"` and make sure `"private": true`. The workspace glob
   `projects/*` picks the package up automatically — run `pnpm install` at
   the **repo root** (not `npm install` here!) so the lockfile stays unified.
3. Delete the demo styling: remove `src/App.css` and gut `src/index.css`.
   Copy `styles.css` to `src/styles.css`, import it once in `src/main.tsx`.
4. Strip `App.tsx` to a shell you'll grow:
   ```tsx
   <div className="app">
     <h1 className="app__title">Todos</h1>
     <p className="app__subtitle">Week 6 — types do the work</p>
   </div>
   ```
5. `pnpm --filter project-react-todo dev` → styled shell in the browser.
   Also add `"typecheck": "tsc -b --noEmit"` (or `tsc --noEmit -p tsconfig.app.json`)
   to its scripts so the root `pnpm typecheck` covers it.

### Definition of done

- [ ] Dev server runs; the shell renders with the provided styling (nice
      background, centered column — if it's unstyled Times New Roman, the CSS
      import is missing).
- [ ] `pnpm --filter project-react-todo typecheck` passes.
- [ ] You can explain why JSX needs no `import React`.

---

## Milestone 2 — Domain types + reducer with a discriminated `Action` union

*(week 6, day 2)*

### Goal

`src/todos.ts`: `Todo`, `Filter`, `Action` types and a pure
`todosReducer(state, action)` — no React yet. Then `useReducer` in `App`.

### Types-first approach

Same discipline as project 01, new costume:

```ts
export const FILTERS = ["all", "active", "done"] as const;
export type Filter = (typeof FILTERS)[number];

export type Todo = { id: string; title: string; done: boolean; createdAt: string };

export type Action =
  | { type: "added"; title: string }
  | { type: "toggled"; id: string }
  | { type: "deleted"; id: string }
  | { type: "clearedDone" };
```

Design rules in play:

- The `Action` union is the app's *entire* write API. A component can't
  corrupt state — it can only describe an event; the reducer decides what it
  means. (Name actions as past-tense events, not commands — they describe
  what happened.)
- The reducer's `switch (action.type)` gets the project-01 `never` default.
  Adding `{ type: "edited"; id; title }` later must break the build *in the
  reducer* until handled.
- `Filter` is UI state, not todo state — keep it in its own `useState<Filter>`
  next to the reducer, and note why it doesn't belong inside each todo.

### Hints

1. Type the reducer as
   `(state: readonly Todo[], action: Action) => readonly Todo[]` — `readonly`
   makes accidental `.push()` in a case branch a compile error, which in
   React is a *correctness* bug (mutated state doesn't re-render).
2. `crypto.randomUUID()` for ids — typed, built-in, no dependency.
3. `useReducer(todosReducer, [])` — hover the returned `dispatch`: its
   parameter is your `Action` union. Try dispatching `{ type: "typo" }` and
   read the error; this is the payoff.

### Definition of done

- [ ] Reducer file has zero React imports (pure domain code).
- [ ] Exhaustive switch verified by the fake-variant trick from project 01.
- [ ] `App` holds `useReducer` + a `useState<Filter>` and can log dispatches.

---

## Milestone 3 — Components with typed props

*(week 6, days 2–3)*

### Goal

`TodoList`, `TodoItem`, and `Filters` components, each with a `type Props`,
composed in `App`. The app renders (still hard-coded input for now).

### Types-first approach

Props are just types — apply the existing rules:

```ts
type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => ( ... );
```

- **No `React.FC`** — annotate the props parameter, let the return type
  infer. (`React.FC` adds nothing since React 18 and muddies generics later.)
- Callbacks flow *down* as narrow function types — `TodoItem` can't dispatch
  arbitrary actions, it can only ask for exactly what its props permit.
  Compare with passing `dispatch` everywhere and note why narrower is better
  (components stay reusable and honest).
- `Filters` gets `filter: Filter; onChange: (f: Filter) => void` and renders
  one button per `FILTERS` entry — the `as const` array from milestone 2 is
  now your render list. Union type + runtime list from one source, again.

Class names to use: `.todo-list` (the `<ul>`), `.todo-list__empty`,
`.todo-item` + `.todo-item--done` (conditionally), `.todo-item__title`,
`.todo-item__delete`, `.filters`, `.filter` + `.filter--active`.

### Hints

1. Conditional class without a library:
   ``className={todo.done ? "todo-item todo-item--done" : "todo-item"}``.
2. `key={todo.id}` on list items — and know why an index key breaks toggling.
3. Filtering: `switch (filter)` with — say it with me — a `never` default.
   Put it in a pure helper `visibleTodos(todos, filter)` in `todos.ts`.

### Definition of done

- [ ] App renders seeded todos; toggle/delete/filter all work via dispatch.
- [ ] `.todo-item--done` strikethrough appears when toggling; the active
      filter pill is highlighted.
- [ ] No `React.FC`, no `any`, no prop that is wider than its component needs.

---

## Milestone 4 — Forms & events, typed and controlled

*(week 6, day 3)*

### Goal

A `TodoForm` component: controlled input, typed submit handler, `.trim()`
validation, clears itself after adding.

### Types-first approach

Event types are the day's drill — write them out, don't paste:

```ts
const [draft, setDraft] = useState("");

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const title = draft.trim();
  if (title === "") return;
  onAdd(title);
  setDraft("");
};
```

- `onChange` on the input takes `React.ChangeEvent<HTMLInputElement>` —
  hover `e.currentTarget.value` and notice it's `string` because the type
  parameter says *which element* this event came from.
- Prefer `currentTarget` over `target`: `currentTarget` is typed as the
  element the handler is attached to; `target` is just `EventTarget`.
- Mostly you won't write these types at all — annotate the *handler inline*
  (`onChange={(e) => setDraft(e.currentTarget.value)}`) and inference fills
  them in. Write them explicitly once today so you know what's being
  inferred.

Class names: the form is `.todo-form`; the provided CSS styles its
`input[type="text"]` and `button` directly — no extra classes needed.

### Hints

1. Submit on the `<form>`, not `onClick` on the button — Enter-to-add comes
   free, and there's exactly one code path.
2. Disable the button when `draft.trim() === ""` — the CSS handles the look.
3. Stretch: extract `Filters`' buttons to use
   `ComponentProps<"button">`-style prop spreading and see how extending
   native elements types out.

### Definition of done

- [ ] Typing + Enter adds a todo; whitespace-only input is rejected; input
      clears after add.
- [ ] You wrote `FormEvent`/`ChangeEvent` annotations by hand at least once,
      then know when to let inference do it.

---

## Milestone 5 — Persistence: a Zod-validated `localStorage` hook

*(week 6, day 5 — after the Zod-inside-hooks day)*

### Goal

`src/useLocalStorage.ts`: a reusable `useLocalStorage<T>` hook that takes a
Zod schema, so corrupted/stale storage can never crash — or worse, silently
poison — the app. Todos survive a refresh.

### Types-first approach

`localStorage` is a *boundary* — same status as the JSON file in project 01
and the API in project 03. Week-5 rules apply inside the hook:

```ts
const useLocalStorage = <T,>(
  key: string,
  schema: ZodType<T>,
  initial: T,
): readonly [T, (next: T) => void] => { ... };
```

- Initial read: `localStorage.getItem` → `null`? use `initial` → else
  `JSON.parse` inside a try → `schema.safeParse` → failure? use `initial`
  (and maybe `console.warn`). Every arrow is a boundary check you've written
  before.
- The schema for todos: `z.array(TodoSchema)` where `TodoSchema` lives in
  `todos.ts`… and now **derive** `type Todo = z.infer<typeof TodoSchema>`,
  replacing the hand-written milestone-2 type. The domain type's source of
  truth moves to the schema the moment persistence exists — exactly what
  project 03 taught.
- Zod v4 reminders: `{ error }` not `{ message }`; top-level `z.uuid()` if
  you want to validate the ids you mint.

Wiring: either lazy-init `useReducer(reducer, undefined, () => readFromStorage())`
plus a `useEffect` that writes on change, or keep the hook generic with
`useState` inside and layer the reducer on top — the guide leaves the design
to you; defend your choice in a comment.

### Hints

1. `JSON.parse` throws on garbage — that try/catch belongs *inside* the hook;
   callers never see it.
2. Write-back effect: `useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value])`.
3. Test the failure path deliberately: in devtools,
   `localStorage.setItem("todos", "&*garbage")` and refresh — the app must
   come up empty, not white-screen.

### Definition of done

- [ ] Todos survive refresh; hand-corrupted storage falls back cleanly.
- [ ] `Todo` is now `z.infer`-derived; the old hand-written type is gone.
- [ ] The hook is generic — demonstrate by also persisting the current
      `Filter` with `z.enum(FILTERS)`.

---

## Milestone 6 — Polish: exhaustive filters, extracted hooks

*(week 6, day 5)*

### Goal

Final pass: every switch exhaustive, logic pulled out of components into
hooks/helpers, footer with counts and "clear done".

### Types-first approach

- Sweep for exhaustiveness: `visibleTodos`, the reducer, anywhere a union
  fans out. Each gets the `never` default (or your `assertNever` from
  project 02 — copy it in; this is why you built a utils library).
- Extract `useTodos()`: a custom hook wrapping the reducer + persistence and
  returning `{ todos, visible, filter, setFilter, add, toggle, remove, clearDone, activeCount }`.
  Hover the inferred return type — that *is* your app's internal API. `App`
  shrinks to composition only.
- Footer: `.app__footer` with "N items left" (`activeCount`) and a
  `.app__clear-done` button — dispatching `{ type: "clearedDone" }`, which
  you added to the union and let the compiler walk you to every switch that
  needed updating. That end-to-end compiler-guided change is the week's
  closing argument.

### Definition of done

- [ ] `App.tsx` is under ~40 lines and contains no business logic.
- [ ] Adding a hypothetical `Filter` value breaks the build in every place
      that must handle it (try it, revert it).
- [ ] `pnpm --filter project-react-todo typecheck` and a full manual pass:
      add, toggle, filter, delete, clear done, refresh — all good, all styled,
      zero CSS written by you.
