"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GigPlatform, PLATFORM_LABELS, TripPurpose } from "@gigtax/shared";
import { AppNav } from "@/components/app-nav";
import { createTrip, deleteTrip, getTrips, type Trip } from "@/lib/api";
import { getToken } from "@/lib/auth";

const TAX_YEAR = new Date().getFullYear();
const today = () => new Date().toISOString().slice(0, 10);

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(today);
  const [kilometers, setKilometers] = useState("10");
  const [purpose, setPurpose] = useState<TripPurpose>(TripPurpose.BUSINESS);
  const [platform, setPlatform] = useState<GigPlatform>(GigPlatform.UBER_EATS);
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    return getTrips(TAX_YEAR)
      .then(setTrips)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    void load().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router, load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createTrip({
        date,
        kilometers: parseFloat(kilometers),
        purpose,
        platform,
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

  async function onDelete(id: string) {
    if (!confirm("Delete this trip?")) return;
    try {
      await deleteTrip(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Trips {TAX_YEAR}
        </h1>
        <AppNav />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="font-medium text-zinc-900">Add trip</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-700">Kilometers</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-700">Purpose</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as TripPurpose)}
              >
                <option value={TripPurpose.BUSINESS}>Business</option>
                <option value={TripPurpose.PERSONAL}>Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-700">Platform</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GigPlatform)}
              >
                {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
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
            {saving ? "Saving..." : "Add trip"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-medium text-zinc-900">Your trips</h2>
          {loading ? (
            <p className="mt-4 text-sm text-zinc-500">Loading...</p>
          ) : trips.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No trips yet.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {trips.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">
                      {String(t.date).slice(0, 10)} · {t.kilometers} km ·{" "}
                      {t.purpose}
                    </p>
                    <p className="text-zinc-500">
                      {PLATFORM_LABELS[t.platform]}
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onDelete(t.id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
