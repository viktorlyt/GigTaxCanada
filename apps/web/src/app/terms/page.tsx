import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — GigTax Canada",
  description: "Terms for using GigTax Canada — worksheet tool, not tax advice.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-zinc-900">
            GigTax Canada
          </Link>
          <Link href="/login" className="text-sm text-zinc-600 underline">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-zinc-500">
          <Link href="/" className="underline">
            Home
          </Link>{" "}
          / Terms
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Terms of Use</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: August 26, 2026</p>

        <article className="prose-zinc mt-8 space-y-6 text-sm leading-relaxed text-zinc-700">
          <p>
            By creating an account or using GigTax Canada, you agree to these terms.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">What the service is</h2>
            <p className="mt-2">
              GigTax Canada is a <strong>worksheet and record-keeping tool</strong> for
              Canadian gig drivers. It helps you organize mileage and vehicle expenses
              aligned with T2125 Chart A concepts. It is{" "}
              <strong>not tax, legal, or accounting advice</strong> and does not file
              returns with CRA.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Your responsibilities</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Enter accurate information and keep your own supporting documents</li>
              <li>Verify all numbers with CRA guides or a qualified CPA before filing</li>
              <li>Keep records for six years as required by CRA</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Free beta</h2>
            <p className="mt-2">
              The service is offered free during beta. We may introduce paid features later
              with notice. Beta software may have bugs; use exports as backups.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Disclaimer of warranties</h2>
            <p className="mt-2">
              The service is provided &quot;as is&quot; without warranties of any kind. We do
              not guarantee that calculations are complete, correct, or accepted by CRA or
              an auditor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Limitation of liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, GigTax Canada and its operator are
              not liable for any indirect, incidental, or consequential damages — including
              lost deductions, penalties, or audit outcomes — arising from your use of the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Acceptable use</h2>
            <p className="mt-2">Do not misuse the service: no hacking, scraping other
            users&apos; data, or unlawful activity.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Termination</h2>
            <p className="mt-2">
              You may stop using the service anytime. We may suspend accounts that violate
              these terms. Export your data before closing your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Governing law</h2>
            <p className="mt-2">
              These terms are governed by the laws of Canada and the province where the
              operator is resident, without regard to conflict-of-law rules.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Contact</h2>
            <p className="mt-2">
              Questions:{" "}
              <a href="mailto:support@gigtaxcanada.com" className="underline">
                support@gigtaxcanada.com
              </a>
            </p>
          </section>

          <p className="text-xs text-zinc-500">
            See also our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </article>
      </main>
    </div>
  );
}
