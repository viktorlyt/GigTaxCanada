"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("driver@test.com");
  const [password, setPassword] = useState("password123");
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">GigTax Canada</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Don&apos;t lose deductions on your gig taxes.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => handleSubmit(e, "login")}>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-white disabled:opacity-50"
          >
            {loading ? "..." : "Sign in"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e as unknown as FormEvent, "register")}
            className="w-full rounded-lg border py-2.5 text-zinc-900"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}