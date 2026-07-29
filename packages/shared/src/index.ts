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

/** Platforms that typically publish year-end business km (Uber/DoorDash-style). */
export const PLATFORM_HAS_ANNUAL_KM: Record<GigPlatform, boolean> = {
  [GigPlatform.UBER_EATS]: true,
  [GigPlatform.DOORDASH]: true,
  [GigPlatform.UBER_RIDES]: true,
  [GigPlatform.INSTACART]: false,
  [GigPlatform.OTHER]: false,
  [GigPlatform.NONE]: false,
};

/** Short guidance shown next to platform pickers. */
export const PLATFORM_KM_HINT: Record<GigPlatform, string> = {
  [GigPlatform.UBER_EATS]:
    "Use the year-end statement km on Platform km. On Trips, log only gap km (to first order, etc.) — do not re-log every delivery.",
  [GigPlatform.DOORDASH]:
    "Use the year-end statement km on Platform km. On Trips, log only gap km — do not re-log every delivery.",
  [GigPlatform.UBER_RIDES]:
    "Use the year-end statement km on Platform km. On Trips, log only gap km — do not re-log every trip.",
  [GigPlatform.INSTACART]:
    "Instacart usually has no annual km. Leave Platform km empty; log all Instacart business km on Trips (single trips or period batches).",
  [GigPlatform.OTHER]:
    "If the platform gives annual km, enter it under Platform km; otherwise log business km on Trips.",
  [GigPlatform.NONE]:
    "Off-platform business (gas, car wash, errands). Log on Trips only — nothing to import.",
};

export interface TaxYearSummary {
  taxYear: number;
  totalKm: number;
  businessKm: number;
  personalKm: number;
  platformReportedKm: number;
  /** businessKm − platformReportedKm (manual business trips beyond platform reports) */
  platformKmGap: number;
  businessUsePercent: number;
  totalExpenses: number;
  deductibleExpenses: number;
  potentialMissedDeduction: number;
  /** True when business use looks unrealistically high with no personal km logged */
  warnUnrealisticBusinessUse: boolean;
  /** latest − earliest odometer reading in tax year; 0 if fewer than 2 readings */
  odometerTotalKm: number;
  /** true when personal/total km came from odometer, not PERSONAL trips */
  usedOdometer: boolean;
  /**
   * True when a platform year-end import exists and BUSINESS trips
   * use the same platform — likely double-counting statement km.
   */
  warnPossibleDoubleCount: boolean;
}
