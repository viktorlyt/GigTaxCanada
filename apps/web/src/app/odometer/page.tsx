"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import {
  deleteOdometerReading,
  getOdometerReadings,
  upsertOdometerReading,
  type OdometerReading,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

const TAX_YEAR = new Date().getFullYear();

export default function OdometerPage() {
  const router = useRouter();
  const [readings, setReadings] = useState<OdometerReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState(`${TAX_YEAR}-01-01`);
  const [reading, setReading] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    return getOdometerReadings(TAX_YEAR)
      .then(setReadings)
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
    setDate(`${TAX_YEAR}-01-01`);
    setReading("");
    setNote("");
  }

  function startEdit(row: OdometerReading) {
    setEditingId(row.id);
    setDate(row.date.slice(0, 10));
    setReading(String(row.reading));
    setNote(row.note ?? "");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Upsert by date — editing a row reuses the same date key.
      await upsertOdometerReading({
        date,
        reading: parseFloat(reading),
        note: note || undefined,
      });
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      await deleteOdometerReading(id);
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Odometer {TAX_YEAR}
        </h1>
        <AppNav />

        <p className="mt-2 text-sm text-zinc-600">
          Log odometer readings (e.g. Jan 1 and Dec 31). With 2+ readings,
          personal km = (latest − earliest) − business km. You do not need to
          log every personal trip.
        </p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="font-medium text-zinc-900">
            {editingId ? "Edit reading" : "Add / update reading"}
          </h2>
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
              <label className="block text-sm text-zinc-700">
                Odometer (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
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
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Save reading"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-medium text-zinc-900">Readings this year</h2>
          {loading ? (
            <p className="mt-4 text-sm text-zinc-500">Loading...</p>
          ) : readings.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">None yet.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {readings.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">
                      {row.date.slice(0, 10)} · {row.reading} km
                    </p>
                    {row.note && <p className="text-zinc-500">{row.note}</p>}
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="text-sm text-zinc-700 underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(row.id)}
                      className="text-sm text-red-600 underline"
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
