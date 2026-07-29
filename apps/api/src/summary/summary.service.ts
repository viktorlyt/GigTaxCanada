import { Injectable } from '@nestjs/common';
import { ExpenseCategory, TripPurpose } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { TaxYearSummary } from './tax-year-summary';

const FULL_DEDUCT_CATEGORIES = new Set<ExpenseCategory>([
  ExpenseCategory.PARKING,
]);

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getTaxYearSummary(
    userId: string,
    taxYear: number,
  ): Promise<TaxYearSummary> {
    const dateRange = {
      gte: new Date(`${taxYear}-01-01`),
      lte: new Date(`${taxYear}-12-31`),
    };

    const [trips, expenses, platformImports, odometerReadings] =
      await Promise.all([
        this.prisma.trip.findMany({ where: { userId, date: dateRange } }),
        this.prisma.expense.findMany({ where: { userId, date: dateRange } }),
        this.prisma.platformImport.findMany({ where: { userId, taxYear } }),
        this.prisma.odometerReading.findMany({
          where: { userId, date: dateRange },
        }),
      ]);

    const platformReportedKm = platformImports.reduce(
      (s, p) => s + p.reportedKm,
      0,
    );

    const businessKmFromTrips = trips
      .filter((t) => t.purpose === TripPurpose.BUSINESS)
      .reduce((s, t) => s + t.kilometers, 0);

    const personalKmFromTrips = trips
      .filter((t) => t.purpose === TripPurpose.PERSONAL)
      .reduce((s, t) => s + t.kilometers, 0);

    const businessKm = businessKmFromTrips + platformReportedKm;
    const platformKmGap = round1(businessKm - platformReportedKm);

    let odometerTotalKm = 0;
    let usedOdometer = false;
    let personalKm = personalKmFromTrips;
    let totalKm = businessKm + personalKm;

    if (odometerReadings.length >= 2) {
      const sorted = [...odometerReadings].sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );
      const earliest = sorted[0]!.reading;
      const latest = sorted[sorted.length - 1]!.reading;
      odometerTotalKm = Math.max(0, latest - earliest);
      usedOdometer = true;
      totalKm = odometerTotalKm;
      personalKm = Math.max(0, totalKm - businessKm);
    }

    const businessUsePercent =
      totalKm > 0
        ? Math.min(100, Math.round((businessKm / totalKm) * 10000) / 100)
        : 0;

    const ratio = businessUsePercent / 100;
    let totalExpenses = 0;
    let deductibleExpenses = 0;

    for (const e of expenses) {
      const amount = Number(e.amount);
      totalExpenses += amount;
      if (FULL_DEDUCT_CATEGORIES.has(e.category as ExpenseCategory)) {
        deductibleExpenses += amount;
      } else {
        deductibleExpenses += amount * ratio;
      }
    }

    const benchmarkDeductible = totalExpenses * 0.9;
    const potentialMissedDeduction =
      benchmarkDeductible > deductibleExpenses
        ? Math.round(benchmarkDeductible - deductibleExpenses)
        : 0;

    const warnUnrealisticBusinessUse =
      businessUsePercent >= 99 && personalKm === 0 && businessKm > 0;

    // Bug-fix signal: same platform in import + BUSINESS trips → statement km likely counted twice.
    const warnPossibleDoubleCount = platformImports.some(
      (p) =>
        p.reportedKm > 0 &&
        trips.some(
          (t) =>
            t.purpose === TripPurpose.BUSINESS && t.platform === p.platform,
        ),
    );

    return {
      taxYear,
      totalKm: round1(Number(totalKm)),
      businessKm: round1(Number(businessKm)),
      personalKm: round1(Number(personalKm)),
      platformReportedKm: round1(Number(platformReportedKm)),
      platformKmGap,
      businessUsePercent,
      totalExpenses: round2(totalExpenses),
      deductibleExpenses: round2(deductibleExpenses),
      potentialMissedDeduction,
      warnUnrealisticBusinessUse,
      odometerTotalKm: round1(odometerTotalKm),
      usedOdometer,
      warnPossibleDoubleCount,
    };
  }

  async exportCsv(userId: string, taxYear: number): Promise<string> {
    const s = await this.getTaxYearSummary(userId, taxYear);
    return [
      'GigTax Canada - Tax year worksheet (not tax advice)',
      `taxYear,${taxYear}`,
      `totalKm,${s.totalKm}`,
      `businessKm,${s.businessKm}`,
      `personalKm,${s.personalKm}`,
      `platformReportedKm,${s.platformReportedKm}`,
      `platformKmGap,${s.platformKmGap}`,
      `businessUsePercent,${s.businessUsePercent}`,
      `totalExpenses,${s.totalExpenses}`,
      `deductibleExpenses,${s.deductibleExpenses}`,
      `potentialMissedDeduction,${s.potentialMissedDeduction}`,
      `warnUnrealisticBusinessUse,${s.warnUnrealisticBusinessUse}`,
      `odometerTotalKm,${s.odometerTotalKm}`,
      `usedOdometer,${s.usedOdometer}`,
      `warnPossibleDoubleCount,${s.warnPossibleDoubleCount}`,
    ].join('\n');
  }
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
