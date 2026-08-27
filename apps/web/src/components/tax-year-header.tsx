"use client";

import { taxYearOptions } from "@/lib/tax-year";

type Props = {
  taxYear: number;
  onTaxYearChange: (year: number) => void;
  onLogout?: () => void;
};

export function TaxYearHeader({ taxYear, onTaxYearChange, onLogout }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
        <label htmlFor="tax-year" className="text-sm font-medium text-zinc-500">
          Tax year
        </label>
        <select
          id="tax-year"
          value={taxYear}
          onChange={(e) => onTaxYearChange(parseInt(e.target.value, 10))}
          className="rounded-lg border bg-white px-3 py-2 text-base font-semibold text-zinc-900"
        >
          {taxYearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 text-sm text-zinc-600 underline"
        >
          Log out
        </button>
      )}
    </div>
  );
}

