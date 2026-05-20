export interface TaxYearSummary {
  taxYear: number;
  totalKm: number;
  businessKm: number;
  personalKm: number;
  platformReportedKm: number;
  businessUsePercent: number;
  totalExpenses: number;
  deductibleExpenses: number;
  potentialMissedDeduction: number;
}
