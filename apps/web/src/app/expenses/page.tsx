"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExpenseCategory } from "@gigtax/shared";
import { AppNav } from "@/components/app-nav";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  type Expense,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

const TAX_YEAR = new Date().getFullYear();
const today = () => new Date().toISOString().slice(0, 10);

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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("50");
  const [category, setCategory] = useState<ExpenseCategory>(
    ExpenseCategory.FUEL,
  );
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    getExpenses(TAX_YEAR)
      .then((rows) =>
        setExpenses(rows.map((e) => ({ ...e, amount: Number(e.amount) }))),
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [router, load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createExpense({
        date,
        amount: parseFloat(amount),
        category,
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
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Expenses {TAX_YEAR}
        </h1>
        <AppNav />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="font-medium text-zinc-900">Add expense</h2>
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
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add expense"}
          </button>
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
                  className="flex items-center justify-between py-3 text-sm"
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
                  <button
                    type="button"
                    onClick={() => void onDelete(e.id)}
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
