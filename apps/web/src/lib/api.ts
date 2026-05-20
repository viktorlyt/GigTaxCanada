import {
  ExpenseCategory,
  GigPlatform,
  TripPurpose,
  type TaxYearSummary,
} from "@gigtax/shared";
import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type AuthResponse = {
  user: { id: string; email: string; name: string | null; role: string };
  accessToken: string;
};

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string, name?: string) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password, name }),
  });
}

export function getSummary(taxYear: number) {
  return apiFetch<TaxYearSummary>(`/summary?taxYear=${taxYear}`);
}

export type Trip = {
  id: string;
  date: string;
  kilometers: number;
  purpose: TripPurpose;
  platform: GigPlatform;
  note: string | null;
};
export type Expense = {
  id: string;
  date: string;
  amount: number; // API may return string from Decimal — coerce with Number()
  category: ExpenseCategory;
  note: string | null;
};
export type PlatformImport = {
  id: string;
  taxYear: number;
  platform: GigPlatform;
  reportedKm: number;
  note: string | null;
};
export function getTrips(taxYear: number) {
  return apiFetch<Trip[]>(`/trips?taxYear=${taxYear}`);
}
export function createTrip(body: {
  date: string;
  kilometers: number;
  purpose: TripPurpose;
  platform: GigPlatform;
  note?: string;
}) {
  return apiFetch<Trip>("/trips", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
export function deleteTrip(id: string) {
  return apiFetch<void>(`/trips/${id}`, { method: "DELETE" });
}
export function getExpenses(taxYear: number) {
  return apiFetch<Expense[]>(`/expenses?taxYear=${taxYear}`);
}
export function createExpense(body: {
  date: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
}) {
  return apiFetch<Expense>("/expenses", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
export function deleteExpense(id: string) {
  return apiFetch<void>(`/expenses/${id}`, { method: "DELETE" });
}
export function getPlatformImports(taxYear: number) {
  return apiFetch<PlatformImport[]>(`/platform-imports?taxYear=${taxYear}`);
}
export function upsertPlatformImport(body: {
  taxYear: number;
  platform: GigPlatform;
  reportedKm: number;
  note?: string;
}) {
  return apiFetch<PlatformImport>("/platform-imports", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function downloadSummaryCsv(taxYear: number) {
  const token = getToken();
  const res = await fetch(`${API_URL}/summary/export?taxYear=${taxYear}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gigtax-${taxYear}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
