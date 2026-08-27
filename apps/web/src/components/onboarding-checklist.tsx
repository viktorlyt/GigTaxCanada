"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TaxYearSummary } from "@gigtax/shared";

const DISMISS_KEY = "gigtax-onboarding-dismissed";

type Step = {
  label: string;
  hint: string;
  href: string;
  done: boolean;
};

function buildSteps(summary: TaxYearSummary): Step[] {
  return [
    {
      label: "Import platform km",
      hint: "Uber/DoorDash year-end total — skip if Instacart-only",
      href: "/import",
      done: summary.platformReportedKm > 0,
    },
    {
      label: "Add odometer readings",
      hint: "At least 2 dates (e.g. Jan 1 and Dec 31)",
      href: "/odometer",
      done: summary.usedOdometer,
    },
    {
      label: "Log business km",
      hint: "Gap trips or Instacart — weekly batch is fine",
      href: "/trips?add=batch",
      done: summary.businessKm > 0,
    },
  ];
}

export function OnboardingChecklist({ summary }: { summary: TaxYearSummary }) {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    setReady(true);
  }, []);

  const steps = buildSteps(summary);
  const allDone = steps.every((s) => s.done);

  if (!ready || dismissed || allDone) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-sky-950">Get started</h2>
          <p className="mt-1 text-sm text-sky-900/80">
            Three steps for a defensible worksheet this tax year.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-sm text-sky-800 underline"
        >
          Dismiss
        </button>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step.label} className="flex gap-3 text-sm">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                step.done
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-sky-900 ring-1 ring-sky-200"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </span>
            <div>
              {step.done ? (
                <p className="font-medium text-zinc-500 line-through">{step.label}</p>
              ) : (
                <Link href={step.href} className="font-medium text-sky-950 underline">
                  {step.label}
                </Link>
              )}
              <p className="text-sky-900/70">{step.hint}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
