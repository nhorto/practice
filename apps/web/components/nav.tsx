"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/playground", label: "Playground" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-5xl items-center gap-8 px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-bold text-sky-400">{"{ts}"}</span>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            TypeScript Dojo
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-md bg-zinc-800/80 px-3 py-1.5 font-medium text-zinc-100"
                    : "rounded-md px-3 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
