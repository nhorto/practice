/**
 * Exercise 03 — useReducer with a discriminated-union Action (solution)
 *
 * Each `case` narrows `action` to one member, so the payload (`action.sku`,
 * `action.code`) is typed without any casts. The `default` branch assigns to
 * `never` — add a fourth action and the reducer stops compiling until you
 * handle it.
 */
import { useReducer } from "react";
import { expect, it } from "vitest";

type CartItem = { sku: string; qty: number };
type CartState = { items: CartItem[]; discountCode: string | null };

type CartAction =
  | { type: "add"; sku: string }
  | { type: "remove"; sku: string }
  | { type: "applyDiscount"; code: string };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((item) => item.sku === action.sku);
      const items = existing
        ? state.items.map((item) =>
            item.sku === action.sku ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...state.items, { sku: action.sku, qty: 1 }];
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter((item) => item.sku !== action.sku) };
    case "applyDiscount":
      return { ...state, discountCode: action.code };
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
};

const Cart = () => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], discountCode: null });
  return (
    <div className="cart">
      <button onClick={() => dispatch({ type: "add", sku: "TS-101" })}>add sample</button>
      <span>{state.items.length} items</span>
    </div>
  );
};

// --- tests ------------------------------------------------------------------

const empty: CartState = { items: [], discountCode: null };

it("adds a new line with qty 1", () => {
  const next = cartReducer(empty, { type: "add", sku: "TS-101" });
  expect(next.items).toEqual([{ sku: "TS-101", qty: 1 }]);
});

it("bumps qty for an existing line", () => {
  const once = cartReducer(empty, { type: "add", sku: "TS-101" });
  const twice = cartReducer(once, { type: "add", sku: "TS-101" });
  expect(twice.items).toEqual([{ sku: "TS-101", qty: 2 }]);
});

it("removes a line", () => {
  const added = cartReducer(empty, { type: "add", sku: "TS-101" });
  const removed = cartReducer(added, { type: "remove", sku: "TS-101" });
  expect(removed.items).toEqual([]);
});

it("applies a discount code", () => {
  const next = cartReducer(empty, { type: "applyDiscount", code: "SAVE10" });
  expect(next.discountCode).toBe("SAVE10");
});

it("does not mutate the previous state", () => {
  const before: CartState = { items: [{ sku: "TS-101", qty: 1 }], discountCode: null };
  cartReducer(before, { type: "add", sku: "TS-101" });
  expect(before.items).toEqual([{ sku: "TS-101", qty: 1 }]);
});

it("rejects actions that don't exist", () => {
  // @ts-expect-error "clear" is not a CartAction
  cartReducer(empty, { type: "clear" });
});

it("ties each payload to its action type", () => {
  // @ts-expect-error "add" carries a sku, not a code
  cartReducer(empty, { type: "add", code: "SAVE10" });
});

it("the Cart component constructs", () => {
  const element = <Cart />;
  expect(element.type).toBe(Cart);
});
