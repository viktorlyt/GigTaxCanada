"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "gigtax-tax-year";
const MIN_YEAR = 2020;

export function currentCalendarYear() {
  return new Date().getFullYear();
}

export function taxYearOptions() {
  const max = currentCalendarYear();
  const years: number[] = [];
  for (let y = max; y >= MIN_YEAR; y--) years.push(y);
  return years;
}

export function readStoredTaxYear(): number {
  if (typeof window === "undefined") return currentCalendarYear();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return currentCalendarYear();
  const y = parseInt(stored, 10);
  if (Number.isNaN(y) || y < MIN_YEAR || y > currentCalendarYear()) {
    return currentCalendarYear();
  }
  return y;
}

/** Default trip/expense date for a tax year (today if current year, else Dec 31). */
export function defaultDateForTaxYear(taxYear: number): string {
  const y = currentCalendarYear();
  if (taxYear === y) {
    return new Date().toISOString().slice(0, 10);
  }
  return `${taxYear}-12-31`;
}

export function useTaxYear() {
  const [taxYear, setTaxYearState] = useState(() => readStoredTaxYear());

  const setTaxYear = useCallback((year: number) => {
    const max = currentCalendarYear();
    const clamped = Math.min(max, Math.max(MIN_YEAR, year));
    localStorage.setItem(STORAGE_KEY, String(clamped));
    setTaxYearState(clamped);
  }, []);

  return { taxYear, setTaxYear };
}
