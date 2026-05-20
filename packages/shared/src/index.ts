export enum TripPurpose {
  BUSINESS = "BUSINESS",
  PERSONAL = "PERSONAL",
}

export enum GigPlatform {
  UBER_EATS = "UBER_EATS",
  DOORDASH = "DOORDASH",
  INSTACART = "INSTACART",
  UBER_RIDES = "UBER_RIDES",
  OTHER = "OTHER",
  NONE = "NONE",
}

export enum ExpenseCategory {
  FUEL = "FUEL",
  INSURANCE = "INSURANCE",
  MAINTENANCE = "MAINTENANCE",
  CAR_WASH = "CAR_WASH",
  PARKING = "PARKING",
  REGISTRATION = "REGISTRATION",
  LEASE_OR_LOAN_INTEREST = "LEASE_OR_LOAN_INTEREST",
  OTHER = "OTHER",
}

export const PLATFORM_LABELS: Record<GigPlatform, string> = {
  [GigPlatform.UBER_EATS]: "Uber Eats",
  [GigPlatform.DOORDASH]: "DoorDash",
  [GigPlatform.INSTACART]: "Instacart",
  [GigPlatform.UBER_RIDES]: "Uber (rides)",
  [GigPlatform.OTHER]: "Other platform",
  [GigPlatform.NONE]: "Off-platform / errands",
};

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