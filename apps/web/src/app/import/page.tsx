"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GigPlatform,
  PLATFORM_HAS_ANNUAL_KM,
  PLATFORM_KM_HINT,
  PLATFORM_LABELS,
} from "@gigtax/shared";
import { AppNav } from "@/components/app-nav";
import { TaxYearHeader } from "@/components/tax-year-header";
import { useTaxYear } from "@/lib/tax-year";
import {
  getPlatformImports,
  upsertPlatformImport,
  type PlatformImport,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function ImportPage() {
  const router = useRouter();
  const { taxYear, setTaxYear } = useTaxYear();
  const [imports, setImports] = useState<PlatformImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [platform, setPlatform] = useState<GigPlatform>(GigPlatform.UBER_EATS);
  const [reportedKm, setReportedKm] = useState("8500");
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    return getPlatformImports(taxYear)
      .then(setImports)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, [taxYear]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    setImports([]);
    setError(null);
    let cancelled = false;
    void load().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router, load, taxYear]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await upsertPlatformImport({
        taxYear,
        platform,
        reportedKm: parseFloat(reportedKm),
        note: note || undefined,
      });
      setNote("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-page flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <TaxYearHeader taxYear={taxYear} onTaxYearChange={setTaxYear} />
        <h1 className="mt-2 text-xl font-semibold text-zinc-900">Platform km</h1>
        <AppNav />

        <p className="mt-2 text-sm text-zinc-600">
          Statement-first platforms (Uber, DoorDash): enter year-end business
          km. Log-first platforms (Instacart): usually skip this page and use
          Trips.
        </p>
        <p className="mt-2 text-sm text-zinc-700">{PLATFORM_KM_HINT[platform]}</p>
        {!PLATFORM_HAS_ANNUAL_KM[platform] && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            This platform usually does not publish annual km. Prefer{" "}
            <a href="/trips" className="cursor-pointer underline">
              Trips
            </a>{" "}
            instead of inventing a Platform number.
          </p>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="font-medium text-zinc-900">Save platform total</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-700">Platform</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GigPlatform)}
              >
                {Object.entries(PLATFORM_LABELS)
                  .filter(([v]) => v !== GigPlatform.NONE)
                  .map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-700">Reported km</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={reportedKm}
                onChange={(e) => setReportedKm(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-700">
              Note (optional)
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-medium text-zinc-900">Saved imports</h2>
          {loading ? (
            <p className="mt-4 text-sm text-zinc-500">Loading...</p>
          ) : imports.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">None yet.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {imports.map((row) => (
                <li key={row.id} className="py-3 text-sm">
                  <p className="font-medium text-zinc-900">
                    {PLATFORM_LABELS[row.platform]} · {row.reportedKm} km
                  </p>
                  {row.note && <p className="text-zinc-500">{row.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
