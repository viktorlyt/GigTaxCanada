"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { setToken } from "@/lib/auth";

function friendlyError(err: unknown): string {
  const message = err instanceof Error ? err.message : "Something went wrong";
  if (message === "Failed to fetch" || message.includes("NetworkError")) {
    return "Can't reach the server — check your connection or try again later.";
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent, mode: "login" | "register") {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, "Driver");
      setToken(data.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 underline-offset-2 hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">GigTax Canada</h1>
        <p className="mt-2 text-sm font-medium text-zinc-800">
          Uber gave you annual km — we help you add the rest.
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Free beta · Worksheet for your records — not tax filing.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => handleSubmit(e, "login")}>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border px-3 py-3 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              autoComplete={email ? "current-password" : "new-password"}
              className="mt-1 w-full rounded-lg border px-3 py-3 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-zinc-900 py-2.5 text-base text-white disabled:opacity-50"
          >
            {loading ? "..." : "Sign in"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e as unknown as FormEvent, "register")}
            className="min-h-11 w-full rounded-lg border py-2.5 text-base text-zinc-900"
          >
            Create free account
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
