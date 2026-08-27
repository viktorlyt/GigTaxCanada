"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { TaxYearSummary } from "@gigtax/shared";
import { AppNav } from "@/components/app-nav";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { InstallPrompt } from "@/components/install-prompt";
import { TaxYearHeader } from "@/components/tax-year-header";
import { useTaxYear } from "@/lib/tax-year";
import { downloadSummaryCsv, getSummary } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const { taxYear, setTaxYear } = useTaxYear();
  const [summary, setSummary] = useState<TaxYearSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    getSummary(taxYear)
      .then(setSummary)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
        if (
          String(err).includes("401") ||
          String(err).includes("Unauthorized")
        ) {
          clearToken();
          router.replace("/login");
        }
      });
  }, [router, taxYear]);

  function logout() {
    clearToken();
    router.push("/login");
  }

  function formatMoney(n: number) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-1 items-center bg-zinc-50 p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-screen flex-1 items-center bg-zinc-50 p-8">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-page flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto max-w-3xl">
        <TaxYearHeader
          taxYear={taxYear}
          onTaxYearChange={setTaxYear}
          onLogout={logout}
        />

        <AppNav />

        <InstallPrompt />

        <OnboardingChecklist summary={summary} />

        {/* Hero: business-use % + km (Offer v1) */}
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Business use (vehicle)</p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-zinc-900">
            {summary.businessUsePercent}%
          </p>
          <p className="mt-2 text-lg font-semibold tabular-nums text-zinc-800">
            {summary.businessKm.toLocaleString("en-CA")} business km
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {summary.totalKm.toLocaleString("en-CA")} total km ·{" "}
            {summary.personalKm.toLocaleString("en-CA")} personal km
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Defensible numbers from what you logged — verify with CRA guides or
            your CPA.
          </p>
        </div>

        {/* Secondary: deductible estimate */}
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-sm text-zinc-500">
            Deductible portion of logged expenses (× business use %)
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">
            {formatMoney(summary.deductibleExpenses)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Based on expenses you entered, not a per-km CRA rate.
          </p>
          {summary.potentialMissedDeduction > 0 && (
            <p className="mt-2 text-sm text-amber-700">
              You could be leaving ~
              {formatMoney(summary.potentialMissedDeduction)} on the table — log
              more business km.
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Stat
            label="Platform reported km"
            value={`${summary.platformReportedKm.toLocaleString("en-CA")} km`}
          />
          <Stat
            label="Total expenses"
            value={formatMoney(summary.totalExpenses)}
          />
        </div>

        {summary.platformReportedKm > 0 && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-800">
              Manual business beyond platform statements
            </p>
            <p className="mt-1 text-lg font-semibold text-emerald-900">
              {summary.platformKmGap > 0 ? "+" : ""}
              {summary.platformKmGap} km from Trips
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              {summary.platformKmGap > 0
                ? "Extra business km from Trips (gap / Instacart / off-platform). Keep notes for CRA."
                : summary.platformKmGap < 0
                  ? "Platform statements exceed logged business trips — check imports or missing Trips."
                  : "No extra Trips beyond platform statements."}
            </p>
          </div>
        )}

        {summary.usedOdometer && (
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-xs text-sky-800">Odometer-based personal km</p>
            <p className="mt-1 text-lg font-semibold text-sky-900">
              {summary.personalKm} personal km · {summary.odometerTotalKm} total
              km
            </p>
            <p className="mt-1 text-sm text-sky-800">
              personal = odometer total − business km
            </p>
          </div>
        )}

        {summary.warnUnrealisticBusinessUse && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              100% business use with no personal km is unusual
            </p>
            <p className="mt-1 text-sm text-amber-800">
              CRA audits often expect some personal driving.{" "}
              <Link href="/odometer" className="underline">
                Add odometer readings
              </Link>{" "}
              so personal km = total − business, or log personal trips.
            </p>
          </div>
        )}

        {summary.warnPossibleDoubleCount && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">
              Possible double-count: platform statement + same-platform trips
            </p>
            <p className="mt-1 text-sm text-red-800">
              You imported year-end km for a platform and also logged BUSINESS
              trips on that platform. Those trip km are added on top of the
              statement — if they are already in the report, delete them or your
              deductible will be too high. True gap km (to first order, etc.)
              should use platform &quot;Off-platform / errands&quot;, not the
              same app name.
            </p>
            <p className="mt-2 text-sm">
              <Link href="/trips" className="underline">
                Review trips
              </Link>
              {" · "}
              <Link href="/import" className="underline">
                Review platform km
              </Link>
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/trips"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
          >
            Log a trip
          </Link>
          <Link
            href="/expenses"
            className="rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900"
          >
            Add expense
          </Link>
          <Link
            href="/import"
            className="rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900"
          >
            Import platform km
          </Link>
          <Link
            href="/odometer"
            className="rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900"
          >
            Odometer
          </Link>
          <button
            type="button"
            onClick={() => void downloadSummaryCsv(taxYear)}
            className="rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900"
          >
            Export CSV
          </button>
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          Not tax advice. Keep your own records for CRA.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
