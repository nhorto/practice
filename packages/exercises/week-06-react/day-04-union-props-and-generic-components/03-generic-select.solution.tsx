/**
 * Exercise 03 — Generic components: Select (locking props together) (solution)
 *
 * `Value extends string` is inferred from the `as const` options, so it lands
 * on the union of option literals. `NoInfer<Value>` keeps `value` from
 * contributing to that inference — it must FIT the union the options chose,
 * not widen it. The `as Value` cast at the DOM boundary is honest: the DOM
 * returns `string`, and we vouch it came from our own `<option>`s.
 */
import { expect, expectTypeOf, it } from "vitest";

type SelectOption<Value extends string> = { value: Value; label: string };

type SelectProps<Value extends string> = {
  value: NoInfer<Value>;
  options: readonly SelectOption<Value>[];
  onChange: (next: Value) => void;
};

const Select = <Value extends string>({ value, options, onChange }: SelectProps<Value>) => (
  <select value={value} onChange={(event) => onChange(event.currentTarget.value as Value)}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// --- tests ------------------------------------------------------------------

const sizeOptions = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
] as const;

it("renders an option per entry", () => {
  const element = Select({ value: "md", options: sizeOptions, onChange: () => {} });
  expect(element.type).toBe("select");
  expect(element.props.value).toBe("md");
  const rendered = element.props.children;
  expect(rendered).toHaveLength(3);
  expect(rendered[2].props.value).toBe("lg");
  expect(rendered[2].props.children).toBe("Large");
});

it("locks value and onChange to the option literals", () => {
  <Select
    value="sm"
    options={sizeOptions}
    onChange={(next) => {
      expectTypeOf(next).toEqualTypeOf<"sm" | "md" | "lg">();
    }}
  />;
  // @ts-expect-error "xl" is not one of the options
  <Select value="xl" options={sizeOptions} onChange={() => {}} />;
});
