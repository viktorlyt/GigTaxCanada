import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GigTax Canada — Multi-platform mileage for Canadian gig drivers",
  description:
    "Import Uber or DoorDash year-end km, log the gap trips they missed, track vehicle expenses, and export a T2125-style worksheet summary. Free beta — not tax advice.",
  openGraph: {
    title: "GigTax Canada",
    description:
      "Complete the km your platforms didn't count — multi-platform mileage and expense tracking for Canadian gig drivers.",
    url: "https://gigtaxcanada.com",
    siteName: "GigTax Canada",
    locale: "en_CA",
    type: "website",
  },
};

const features = [
  {
    title: "Import platform km",
    body: "Paste Uber or DoorDash year-end statement km. Instacart and other apps usually need manual trips — we show platform-specific hints.",
  },
  {
    title: "Log the gap, not every delivery",
    body: "Add off-platform errands, gas runs, and between-app driving. Period batch entry covers a whole week in one trip.",
  },
  {
    title: "Avoid double-counting",
    body: "If you import statement km and also log same-platform business trips, we warn you before your deductible looks inflated.",
  },
  {
    title: "Business-use % + export",
    body: "Odometer readings, expense categories, and a CSV summary aligned with T2125 Chart A concepts — verify with CRA guides or your CPA.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-zinc-900">GigTax Canada</span>
          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-700 ring-1 ring-zinc-200"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <section className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-800">Free beta · Canada only</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Uber gave you annual km — we help you add the rest.
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            For Canadian drivers on Uber, DoorDash, Instacart, or multiple apps: import
            platform statements, log business km they didn&apos;t count, track vehicle
            expenses, and export a worksheet summary for tax season.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Start free
            </Link>
            <Link
              href="/guides/uber-eats-t2125-canada"
              className="rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-zinc-900"
            >
              Uber Eats & T2125 guide
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-zinc-900">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-zinc-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-zinc-900">
            How we&apos;re different from auto-trackers
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Apps like RideWiz lead with background GPS mileage. GigTax is built for{" "}
            <strong className="font-medium text-zinc-800">
              multi-platform reconciliation
            </strong>
            : you control what counts as business km, import what Uber or DoorDash
            already reported, and fill the gap with clarity — not another always-on
            tracker.
          </p>
        </section>

        <section className="mt-12 border-t pt-8">
          <p className="text-xs leading-relaxed text-zinc-500">
            GigTax Canada provides information tools only — not tax, legal, or
            accounting advice. Keep your records for six years (CRA). Verify numbers
            with official CRA guides or a qualified CPA before filing.
          </p>
        </section>
      </main>
    </div>
  );
}
