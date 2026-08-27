"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { downloadSummaryCsv } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { readStoredTaxYear } from "@/lib/tax-year";

const desktopLinks = [
  { href: "/dashboard", label: "Summary" },
  { href: "/trips", label: "Trips" },
  { href: "/expenses", label: "Expenses" },
  { href: "/import", label: "Platform km" },
  { href: "/odometer", label: "Odometer" },
];

const mobileLinks = [
  { href: "/dashboard", label: "Summary" },
  { href: "/trips", label: "Trips" },
  { href: "/trips?add=batch", label: "Add", accent: true },
  { href: "/expenses", label: "Costs" },
];

const morePaths = ["/import", "/odometer"];

function isActive(
  pathname: string,
  href: string,
  searchParams: URLSearchParams,
  accent?: boolean,
) {
  if (pathname !== "/trips") {
    if (accent) return false;
    return pathname === href.split("?")[0];
  }
  if (accent) return searchParams.get("add") === "batch";
  if (href.startsWith("/trips")) return searchParams.get("add") !== "batch";
  return pathname === href;
}

function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = morePaths.includes(pathname) || moreOpen;

  async function onExport() {
    setMoreOpen(false);
    try {
      await downloadSummaryCsv(readStoredTaxYear());
    } catch {
      alert("Export failed. Try again.");
    }
  }

  function onLogout() {
    clearToken();
    setMoreOpen(false);
    router.push("/login");
  }

  return (
    <>
      {moreOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="fixed inset-x-0 z-50 mx-auto max-w-lg px-3 md:hidden"
            style={{ bottom: "calc(3.75rem + env(safe-area-inset-bottom, 0px))" }}
            role="menu"
            aria-label="More"
          >
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
              <Link
                href="/import"
                role="menuitem"
                onClick={() => setMoreOpen(false)}
                className={`flex min-h-12 items-center px-4 text-sm font-medium ${
                  pathname === "/import"
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100"
                }`}
              >
                Platform km
              </Link>
              <Link
                href="/odometer"
                role="menuitem"
                onClick={() => setMoreOpen(false)}
                className={`flex min-h-12 items-center border-t border-zinc-100 px-4 text-sm font-medium ${
                  pathname === "/odometer"
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100"
                }`}
              >
                Odometer
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => void onExport()}
                className="flex min-h-12 w-full items-center border-t border-zinc-100 px-4 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100"
              >
                Export CSV
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className="flex min-h-12 w-full items-center border-t border-zinc-100 px-4 text-left text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100"
              >
                Log out
              </button>
            </div>
          </div>
        </>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Main"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
          {mobileLinks.map((l) => {
            const active = isActive(pathname, l.href, searchParams, l.accent);
            return (
              <li key={l.label} className="flex-1">
                <Link
                  href={l.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-center text-[11px] font-medium leading-tight transition-colors duration-150 ${
                    l.accent
                      ? active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200"
                        : "text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100"
                      : active
                        ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300"
                        : "text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200"
                  }`}
                >
                  <span
                    className={
                      l.accent
                        ? "text-xl font-semibold leading-none"
                        : "text-base leading-none"
                    }
                  >
                    {l.accent ? "+" : l.label.charAt(0)}
                  </span>
                  <span>{l.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((open) => !open)}
              className={`flex min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-center text-[11px] font-medium leading-tight transition-colors duration-150 ${
                moreActive
                  ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300"
                  : "text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200"
              }`}
            >
              <span className="text-base leading-none">⋯</span>
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="mb-6 hidden flex-wrap gap-2 border-b pb-4 md:flex">
        {desktopLinks.map((l) => (
          <Link
            key={l.href + l.label}
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

      <Suspense fallback={<div className="h-16 md:hidden" aria-hidden />}>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}
