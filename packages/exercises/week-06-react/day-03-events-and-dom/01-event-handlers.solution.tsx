/**
 * Exercise 01 — Typing event handlers (solution)
 *
 * Each extracted handler names both the event kind and the element it came
 * from: `ChangeEvent<HTMLInputElement>` gives `event.target.value: string`,
 * `KeyboardEvent` gives `key`/`shiftKey`, `FormEvent` gives
 * `preventDefault`. All imported from "react" — never the DOM globals.
 */
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

const readSearchTerm = (event: ChangeEvent<HTMLInputElement>) =>
  event.target.value.trim().toLowerCase();

const shouldSubmitOnEnter = (event: KeyboardEvent<HTMLInputElement>) =>
  event.key === "Enter" && !event.shiftKey;

const stopNativeSubmit = (event: FormEvent<HTMLFormElement>) => {
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
