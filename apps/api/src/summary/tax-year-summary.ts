export interface TaxYearSummary {
  taxYear: number;
  totalKm: number;
  businessKm: number;
  personalKm: number;
  platformReportedKm: number;
  /** businessKm − platformReportedKm */
  platformKmGap: number;
  businessUsePercent: number;
  totalExpenses: number;
  deductibleExpenses: number;
  potentialMissedDeduction: number;
  warnUnrealisticBusinessUse: boolean;
  odometerTotalKm: number;
  usedOdometer: boolean;
  warnPossibleDoubleCount: boolean;
}
