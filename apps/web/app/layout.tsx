import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TypeScript Dojo",
    template: "%s · TypeScript Dojo",
  },
  description:
    "8-week TypeScript curriculum dashboard and in-browser type-checking playground.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
