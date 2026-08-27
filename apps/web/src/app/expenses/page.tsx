"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExpenseCategory } from "@gigtax/shared";
import { AppNav } from "@/components/app-nav";
import { TaxYearHeader } from "@/components/tax-year-header";
import {
  defaultDateForTaxYear,
  readStoredTaxYear,
  useTaxYear,
} from "@/lib/tax-year";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
  type Expense,
} from "@/lib/api";
import { getToken } from "@/lib/auth";


const EXPENSE_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FUEL]: "Fuel",
  [ExpenseCategory.INSURANCE]: "Insurance",
  [ExpenseCategory.MAINTENANCE]: "Maintenance",
  [ExpenseCategory.CAR_WASH]: "Car wash",
  [ExpenseCategory.PARKING]: "Parking",
  [ExpenseCategory.REGISTRATION]: "Registration",
  [ExpenseCategory.LEASE_OR_LOAN_INTEREST]: "Lease / loan interest",
  [ExpenseCategory.OTHER]: "Other",
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

export default function ExpensesPage() {
  const router = useRouter();
  const { taxYear, setTaxYear } = useTaxYear();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState(() => defaultDateForTaxYear(readStoredTaxYear()));
  const [amount, setAmount] = useState("50");
  const [category, setCategory] = useState<ExpenseCategory>(
    ExpenseCategory.FUEL,
  );
  const [note, setNote] = useState("");

  useEffect(() => {
    if (editingId) return;
    setDate(defaultDateForTaxYear(taxYear));
  }, [taxYear, editingId]);

  const load = useCallback(() => {
    return getExpenses(taxYear)
      .then((rows) =>
        setExpenses(rows.map((e) => ({ ...e, amount: Number(e.amount) }))),
      )
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
    setExpenses([]);
    setError(null);
    let cancelled = false;
    void load().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router, load, taxYear]);

  function resetForm() {
    setEditingId(null);
    setDate(defaultDateForTaxYear(taxYear));
    setAmount("50");
    setCategory(ExpenseCategory.FUEL);
    setNote("");
  }

  function startEdit(e: Expense) {
    setEditingId(e.id);
    setDate(String(e.date).slice(0, 10));
    setAmount(String(e.amount));
    setCategory(e.category);
    setNote(e.note ?? "");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = {
      date,
      amount: parseFloat(amount),
      category,
      note: note || undefined,
    };
    try {
      if (editingId) {
        await updateExpense(editingId, body);
      } else {
        await createExpense(body);
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
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="app-page flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <TaxYearHeader taxYear={taxYear} onTaxYearChange={setTaxYear} />
        <h1 className="mt-2 text-xl font-semibold text-zinc-900">Expenses</h1>
        <AppNav />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="font-medium text-zinc-900">
            {editingId ? "Edit expense" : "Add expense"}
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
                Amount (CAD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-zinc-700">Category</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                {Object.entries(EXPENSE_LABELS).map(([value, label]) => (
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
                  : "Add expense"}
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
          <h2 className="font-medium text-zinc-900">Your expenses</h2>
          {loading ? (
            <p className="mt-4 text-sm text-zinc-500">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No expenses yet.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {expenses.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">
                      {String(e.date).slice(0, 10)} · {formatMoney(e.amount)}
                    </p>
                    <p className="text-zinc-500">
                      {EXPENSE_LABELS[e.category]}
                      {e.note ? ` · ${e.note}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(e)}
                      className="cursor-pointer text-zinc-700 underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(e.id)}
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
