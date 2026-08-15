/**
 * Exercise 01 — useState: inference vs explicit type arguments
 *
 * `useState` infers the state type from the initial value. That's perfect
 * for `useState("")` — but `useState([])` infers `never[]` and
 * `useState(null)` infers `null`: states you can never update. When the
 * initial value doesn't tell the whole story, pass the type argument
 * yourself.
 *
 * 🎯 Give `todos` and `error` explicit type arguments:
 *    `useState<Todo[]>([])` and `useState<string | null>(null)`.
 *    Leave `draft` alone — inference already nails it.
 */
import { useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

type Todo = { id: number; title: string; done: boolean };

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState("");

  // Checked at compile time — the component itself is never invoked in this
  // package (there is no renderer).
  expectTypeOf(todos).toEqualTypeOf<Todo[]>();
  expectTypeOf(error).toEqualTypeOf<string | null>();
  expectTypeOf(draft).toEqualTypeOf<string>();

  const addTodo = () => {
    setTodos([...todos, { id: todos.length + 1, title: draft, done: false }]);
    setDraft("");
  };

  const loadFailed = () => setError("Could not load todos");

  return (
    <div className={error === null ? "todos" : "todos has-error"}>
      <button onClick={addTodo}>add</button>
      <button onClick={loadFailed}>simulate failure</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.done ? `done: ${todo.title}` : todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

// --- tests ------------------------------------------------------------------

it("the component still constructs (nothing renders in this package)", () => {
  const element = <TodoApp />;
  expect(element.type).toBe(TodoApp);
  expect(element.props).toEqual({});
});
