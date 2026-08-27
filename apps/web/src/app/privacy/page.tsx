import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GigTax Canada",
  description: "How GigTax Canada handles your personal information (PIPEDA).",
};

export default function PrivacyPage() {
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
          / Privacy
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: August 26, 2026</p>

        <article className="prose-zinc mt-8 space-y-6 text-sm leading-relaxed text-zinc-700">
          <p>
            GigTax Canada (&quot;we&quot;, &quot;us&quot;) operates gigtaxcanada.com — a
            worksheet tool for Canadian gig drivers. This policy describes how we
            collect, use, and protect personal information under Canada&apos;s{" "}
            <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong>.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">What we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account: email address, password (stored hashed), optional name</li>
              <li>
                Tax worksheet data you enter: trip km, expenses, platform imports,
                odometer readings, notes
              </li>
              <li>
                Technical: server logs (IP, browser type, timestamps) for security and
                debugging
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Why we collect it</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide the service (store your records, calculate summaries, export CSV)</li>
              <li>Authenticate your account</li>
              <li>Improve reliability and fix bugs</li>
              <li>Respond to support requests you send us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">What we do not do</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Sell your personal information</li>
              <li>Share your data with advertisers</li>
              <li>File taxes on your behalf or provide tax advice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Where data is stored</h2>
            <p className="mt-2">
              Your data is stored on secure servers used to run the application (hosting
              and database providers). Data may be processed outside your province; we
              use providers that maintain appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Retention</h2>
            <p className="mt-2">
              We keep your account data while your account is active. You may request
              deletion (see below). For tax records, CRA generally expects you to keep
              supporting documents for <strong>six years</strong> — export your CSV before
              deleting your account if you need those records.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Your rights</h2>
            <p className="mt-2">You may request to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information (edit in the app or contact us)</li>
              <li>Delete your account and associated data</li>
            </ul>
            <p className="mt-2">
              Contact:{" "}
              <a href="mailto:privacy@gigtaxcanada.com" className="underline">
                privacy@gigtaxcanada.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Security</h2>
            <p className="mt-2">
              We use HTTPS, password hashing, and access controls. No method is 100%
              secure; use a strong unique password.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Changes</h2>
            <p className="mt-2">
              We may update this policy. The &quot;Last updated&quot; date will change.
              Continued use after changes means you accept the updated policy.
            </p>
          </section>

          <p className="text-xs text-zinc-500">
            This is a general privacy notice for a beta product, not legal advice. Consult
            a lawyer for your specific obligations if you scale commercially.
          </p>
        </article>
      </main>
    </div>
  );
}
