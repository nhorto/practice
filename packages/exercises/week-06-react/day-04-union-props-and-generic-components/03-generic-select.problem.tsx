/**
 * Exercise 03 — Generic components: Select (locking props together)
 *
 * The real power of a generic component is RELATIONSHIPS between props:
 * whatever literal values appear in `options`, `value` must be one of them,
 * and `onChange` hands back exactly that union. Two details do the heavy
 * lifting:
 *   - `Value extends string` + `as const` options keep the literals narrow
 *   - `NoInfer<Value>` on `value` stops a bad value from WIDENING the
 *     inference — `value="xl"` must be an error, not a new union member
 *
 * 🎯 Make `Select` generic over the option value type. Use `NoInfer` so only
 *    `options` drives the inference.
 */
import { expect, expectTypeOf, it } from "vitest";

type SelectOption = { value: string; label: string };

type SelectProps = {
  value: string;
  options: readonly SelectOption[];
  onChange: (next: string) => void;
};

const Select = ({ value, options, onChange }: SelectProps) => (
  <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
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
