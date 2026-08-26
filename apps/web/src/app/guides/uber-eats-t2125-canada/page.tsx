import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uber Eats taxes Canada & T2125 vehicle expenses (2026 guide)",
  description:
    "How Canadian Uber Eats drivers track business km, business-use percentage, and T2125 Chart A vehicle expenses — plus when platform statements aren't enough.",
  openGraph: {
    title: "Uber Eats T2125 Canada — mileage & vehicle expenses",
    description:
      "Practical checklist for Canadian gig drivers: platform km, gap trips, business-use %, and exportable records.",
    url: "https://gigtaxcanada.com/guides/uber-eats-t2125-canada",
    locale: "en_CA",
    type: "article",
  },
};

export default function UberEatsT2125GuidePage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-zinc-900">
            GigTax Canada
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white"
          >
            Start free
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="text-sm text-zinc-500">
          <Link href="/" className="underline">
            Home
          </Link>{" "}
          / Guides
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
          Uber Eats taxes in Canada: T2125 vehicle km & expenses
        </h1>
        <p className="mt-4 text-zinc-600">
          If you deliver with Uber Eats (or mix Uber with DoorDash / Instacart), CRA
          expects you to support{" "}
          <strong className="font-medium text-zinc-800">business-use percentage</strong>{" "}
          and vehicle expenses on your T2125 — not just a single km number from the app.
        </p>

        <article className="prose-zinc mt-10 space-y-8 text-sm leading-relaxed text-zinc-700">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              1. Start with Uber&apos;s year-end km (if you have it)
            </h2>
            <p className="mt-2">
              Uber often provides total km for the tax year in your annual tax summary.
              That figure usually reflects trip km on-platform — not every business
              kilometre (driving to a hot zone, between apps, car wash, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              2. Log &quot;gap&quot; business trips separately
            </h2>
            <p className="mt-2">
              Add manual business trips for off-platform driving. Tag them clearly so
              you don&apos;t re-log every delivery Uber already counted. Many drivers
              use weekly batch entries (e.g. &quot;Week of May 12–18 — off-platform
              errands&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              3. Watch for double-counting
            </h2>
            <p className="mt-2">
              Importing Uber&apos;s statement km <em>and</em> logging every Uber-tagged
              business trip can inflate your deductible. Use one source for platform km
              and manual entries only for the gap.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              4. Business-use % drives deductible expenses
            </h2>
            <p className="mt-2">
              Total business km ÷ total vehicle km (often from odometer readings) =
              business-use percentage. Fuel, insurance, maintenance, and similar costs
              are typically applied at that percentage on Chart A — keep receipts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              5. Export a worksheet, not a filed return
            </h2>
            <p className="mt-2">
              A good tool gives you a CSV or printable summary you can hand to your
              accountant or enter into your tax software. It should not claim to
              &quot;file T2125 for you.&quot;
            </p>
          </section>
        </article>

        <div className="mt-12 rounded-2xl border bg-white p-8">
          <h2 className="font-semibold text-zinc-900">Try GigTax Canada (free beta)</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Import Uber km, log gap trips with batch entry, track expenses, and export
            a summary — with warnings if platform and manual km overlap.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Create free account
          </Link>
        </div>

        <p className="mt-12 text-xs leading-relaxed text-zinc-500">
          Information only — not tax advice. Rules change; confirm with CRA publications
          or a CPA licensed in your province.
        </p>
      </main>
    </div>
  );
}
