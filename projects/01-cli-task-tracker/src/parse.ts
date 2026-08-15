/**
 * argv parsing — milestone 2.
 *
 * You will design a discriminated `Command` union covering every command the
 * CLI supports, then implement `parseCommand` to turn raw argv into it.
 * Invalid input is NOT an exception — it's a value: { kind: "invalid", ... }.
 */

/**
 * TODO milestone 2: grow this placeholder into the full discriminated union.
 * The tests (and the guide) pin down the exact contract:
 *   add <title>            -> { kind: "add", title }
 *   done <id>              -> { kind: "done", id }        (id is a number!)
 *   list [--status s]      -> { kind: "list", status?: TaskStatus }
 *   help | --help | (none) -> { kind: "help" }
 *   anything else          -> { kind: "invalid", reason }
 */
export type Command = { kind: "help" };

export const parseCommand = (argv: readonly string[]): Command => {
  throw new Error("TODO: milestone 2");
};
