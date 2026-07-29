"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GigPlatform,
  PLATFORM_HAS_ANNUAL_KM,
  PLATFORM_KM_HINT,
  PLATFORM_LABELS,
  TripPurpose,
} from "@gigtax/shared";
import { AppNav } from "@/components/app-nav";
import {
  createTrip,
  deleteTrip,
  getTrips,
  updateTrip,
  type Trip,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

const TAX_YEAR = new Date().getFullYear();
const today = () => new Date().toISOString().slice(0, 10);

type EntryMode = "single" | "range";

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryMode, setEntryMode] = useState<EntryMode>("single");

  const [date, setDate] = useState(today);
  const [rangeStart, setRangeStart] = useState(today);
  const [rangeEnd, setRangeEnd] = useState(today);
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

  function resetForm() {
    setEditingId(null);
    setEntryMode("single");
    setDate(today());
    setRangeStart(today());
    setRangeEnd(today());
    setKilometers("10");
    setPurpose(TripPurpose.BUSINESS);
    setPlatform(GigPlatform.UBER_EATS);
    setNote("");
  }

  function startEdit(t: Trip) {
    setEditingId(t.id);
    setEntryMode("single");
    setDate(String(t.date).slice(0, 10));
    setKilometers(String(t.kilometers));
    setPurpose(t.purpose);
    setPlatform(t.platform);
    setNote(t.note ?? "");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const km = parseFloat(kilometers);
    if (Number.isNaN(km) || km <= 0) {
      setError("Kilometers must be a positive number");
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await updateTrip(editingId, {
          date,
          kilometers: km,
          purpose,
          platform,
          note: note || undefined,
        });
      } else if (entryMode === "range") {
        if (rangeEnd < rangeStart) {
          setError("Period end must be on or after period start");
          setSaving(false);
          return;
        }
        // One BUSINESS trip for the period — note keeps the range for CRA.
        await createTrip({
          date: rangeEnd,
          kilometers: km,
          purpose: TripPurpose.BUSINESS,
          platform,
          note: note.trim() || `${rangeStart} → ${rangeEnd}`,
        });
      } else {
        await createTrip({
          date,
          kilometers: km,
          purpose,
          platform,
          note: note || undefined,
        });
      }
      resetForm();
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
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  const showRange = !editingId && entryMode === "range";

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Trips {TAX_YEAR}
        </h1>
        <AppNav />

        <p className="mt-2 text-sm text-zinc-600">
          Log business km that are <strong>not</strong> already in a platform
          year-end total (gap), or <strong>all</strong> km for platforms without
          a statement (e.g. Instacart). Personal km: prefer Odometer.
        </p>
        <p className="mt-2 text-sm text-zinc-700">{PLATFORM_KM_HINT[platform]}</p>
        {PLATFORM_HAS_ANNUAL_KM[platform] && (
          <p className="mt-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
            You likely already imported this platform&apos;s annual km. Only add
            extra gap trips here — re-logging every delivery double-counts. Tag
            true gap as &quot;Off-platform / errands&quot; if needed.
          </p>
        )}

        {error && <p className="mb-4 mt-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={onSubmit}
          className="mt-4 space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="font-medium text-zinc-900">
            {editingId
              ? "Edit trip"
              : showRange
                ? "Add period business km"
                : "Add trip"}
          </h2>

          {!editingId && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEntryMode("single")}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm ${
                  entryMode === "single"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                Single trip
              </button>
              <button
                type="button"
                onClick={() => {
                  setEntryMode("range");
                  setPurpose(TripPurpose.BUSINESS);
                }}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm ${
                  entryMode === "range"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                Period batch
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {showRange ? (
              <>
                <div>
                  <label className="block text-sm text-zinc-700">
                    Period start
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-700">
                    Period end
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
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
            )}
            <div>
              <label className="block text-sm text-zinc-700">
                {showRange ? "Total km for period" : "Kilometers"}
              </label>
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
            {!showRange && (
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
            )}
            <div className={showRange ? "sm:col-span-2" : undefined}>
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
              {showRange && (
                <span className="font-normal text-zinc-500">
                  {" "}
                  — defaults to date range
                </span>
              )}
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                showRange ? `${rangeStart} → ${rangeEnd}` : undefined
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : showRange
                    ? "Add period km"
                    : "Add trip"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900"
              >
                Cancel
              </button>
            )}
          </div>
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
                  className="flex items-center justify-between gap-4 py-3 text-sm"
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
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(t)}
                      className="cursor-pointer text-zinc-700 underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(t.id)}
                      className="cursor-pointer text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
