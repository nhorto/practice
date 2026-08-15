/**
 * Exercise 02 — Generic components: List
 *
 * `unknown[]` accepts any items but tells the callbacks nothing — every
 * `renderItem` starts with a cast or a type error. A generic component links
 * the props: whatever `items` array you pass, `keyFor` and `renderItem`
 * receive that element type. (Note the `<Item,>` trailing comma generic
 * syntax in `.tsx` files — without it the parser reads a JSX tag.)
 *
 * 🎯 Make `ListProps` and `List` generic over the item type.
 */
import type { ReactNode } from "react";
import { expect, expectTypeOf, it } from "vitest";

type ListProps = {
  items: readonly unknown[];
  keyFor: (item: unknown) => string;
  renderItem: (item: unknown, index: number) => ReactNode;
};

const List = ({ items, keyFor, renderItem }: ListProps) => (
  <ul>
    {items.map((item, index) => (
      <li key={keyFor(item)}>{renderItem(item, index)}</li>
    ))}
  </ul>
);

// --- tests ------------------------------------------------------------------

type User = { id: number; name: string };

const users: User[] = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Grace" },
];

it("renders one li per item with the derived key", () => {
  const element = List({
    items: users,
    keyFor: (user) => `user-${user.id}`,
    renderItem: (user, index) => `${index + 1}. ${user.name}`,
  });
  expect(element.type).toBe("ul");
  const rows = element.props.children;
  expect(rows).toHaveLength(2);
  expect(rows[0].key).toBe("user-1");
  expect(rows[0].props.children).toBe("1. Ada");
  expect(rows[1].props.children).toBe("2. Grace");
});

it("the callbacks receive the exact item type", () => {
  <List
    items={users}
    keyFor={(user) => String(user.id)}
    renderItem={(user) => {
      expectTypeOf(user).toEqualTypeOf<User>();
      return <strong>{user.name}</strong>;
    }}
  />;
});

it("infers a fresh item type at every call site", () => {
  <List items={["read", "write"]} keyFor={(verb) => verb} renderItem={(verb) => verb.toUpperCase()} />;
  <List items={[10, 20]} keyFor={(n) => String(n)} renderItem={(n) => n.toFixed(1)} />;
});
