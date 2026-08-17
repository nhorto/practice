/**
 * Exercise 01 — Typing event handlers
 *
 * Inline handlers (`onChange={(event) => ...}`) get their event type
 * inferred from the JSX prop. The moment you extract a handler into its own
 * function, that inference is gone — you annotate the parameter yourself
 * with React's event types: `ChangeEvent<HTMLInputElement>`,
 * `KeyboardEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, ...
 * Import them from "react" — the global DOM `KeyboardEvent` is a different
 * type and will not fit.
 *
 * 🎯 Annotate the three extracted handlers. Hover the inline handlers in the
 *    JSX to see the types React would have inferred for you.
 */
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

const readSearchTerm = (event) => event.target.value.trim().toLowerCase();

const shouldSubmitOnEnter = (event) => event.key === "Enter" && !event.shiftKey;

const stopNativeSubmit = (event) => {
  event.preventDefault();
};

const SearchForm = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [term, setTerm] = useState("");
  return (
    <form
      onSubmit={(event) => {
        stopNativeSubmit(event);
        onSearch(term);
      }}
    >
      <input
        value={term}
        onChange={(event) => setTerm(readSearchTerm(event))}
        onKeyDown={(event) => {
          if (shouldSubmitOnEnter(event)) onSearch(term);
        }}
      />
    </form>
  );
};

// --- tests ------------------------------------------------------------------

// No DOM here — the tests hand the handlers minimal fake events. The double
// cast (`as unknown as ...`) is a test-only trick, not something for app code.

it("normalizes the search term from a change event", () => {
  const event = { target: { value: "  TypeScript  " } } as unknown as ChangeEvent<HTMLInputElement>;
  expect(readSearchTerm(event)).toBe("typescript");
});

it("submits on plain Enter, not Shift+Enter", () => {
  const enter = { key: "Enter", shiftKey: false } as unknown as KeyboardEvent<HTMLInputElement>;
  const shiftEnter = { key: "Enter", shiftKey: true } as unknown as KeyboardEvent<HTMLInputElement>;
  expect(shouldSubmitOnEnter(enter)).toBe(true);
  expect(shouldSubmitOnEnter(shiftEnter)).toBe(false);
});

it("prevents the native form submit", () => {
  let prevented = false;
  const event = {
    preventDefault: () => {
      prevented = true;
    },
  } as unknown as FormEvent<HTMLFormElement>;
  stopNativeSubmit(event);
  expect(prevented).toBe(true);
});

it("uses React's event types", () => {
  expectTypeOf(readSearchTerm).parameter(0).toEqualTypeOf<ChangeEvent<HTMLInputElement>>();
  expectTypeOf(shouldSubmitOnEnter).parameter(0).toEqualTypeOf<KeyboardEvent<HTMLInputElement>>();
  expectTypeOf(stopNativeSubmit).parameter(0).toEqualTypeOf<FormEvent<HTMLFormElement>>();
});

it("the form constructs", () => {
  const element = <SearchForm onSearch={() => {}} />;
  expect(element.type).toBe(SearchForm);
});
