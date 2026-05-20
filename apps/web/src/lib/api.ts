import type { TaxYearSummary } from "@gigtax/shared";
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