"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Summary" },
  { href: "/trips", label: "Trips" },
  { href: "/expenses", label: "Expenses" },
  { href: "/import", label: "Platform km" },
  { href: "/odometer", label: "Odometer" },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b pb-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            pathname === l.href
              ? "bg-zinc-900 text-white"
              : "bg-white text-zinc-700 ring-1 ring-zinc-200"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
