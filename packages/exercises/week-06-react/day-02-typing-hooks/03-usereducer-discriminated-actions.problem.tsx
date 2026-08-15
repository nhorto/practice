/**
 * Exercise 03 — useReducer with a discriminated-union Action
 *
 * The reducer is the heart of `useReducer`, and it's just a pure function —
 * the most testable code in a React app. Model the actions as a
 * discriminated union and TypeScript narrows the payload inside each
 * `case`, checks exhaustiveness, and rejects bogus dispatches at the call
 * site. `{ type: string }` promises none of that.
 *
 * 🎯 1. Replace `CartAction` with a discriminated union of the three actions
 *       described below.
 *    2. Implement `cartReducer` as an exhaustive `switch` on `action.type`
 *       with a `never`-checked `default` branch. Don't mutate `state`.
 */
import { useReducer } from "react";
import { expect, it } from "vitest";

type CartItem = { sku: string; qty: number };
type CartState = { items: CartItem[]; discountCode: string | null };

// The three actions:
//   { type: "add"; sku: string }            → new line with qty 1, or bump the existing line's qty
//   { type: "remove"; sku: string }         → drop the line entirely
//   { type: "applyDiscount"; code: string } → set discountCode
type CartAction = { type: string };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  // TODO: switch on action.type — one case per action, never-checked default
  return state;
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
