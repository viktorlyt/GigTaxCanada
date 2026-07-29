import { ExpenseCategory, GigPlatform, TripPurpose } from '@prisma/client';
import { SummaryService } from './summary.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SummaryService', () => {
  const userId = 'user-1';
  const taxYear = 2026;

  let prisma: {
    trip: { findMany: jest.Mock };
    expense: { findMany: jest.Mock };
    platformImport: { findMany: jest.Mock };
    odometerReading: { findMany: jest.Mock };
  };
  let service: SummaryService;

  beforeEach(() => {
    prisma = {
      trip: { findMany: jest.fn().mockResolvedValue([]) },
      expense: { findMany: jest.fn().mockResolvedValue([]) },
      platformImport: { findMany: jest.fn().mockResolvedValue([]) },
      odometerReading: { findMany: jest.fn().mockResolvedValue([]) },
    };
    service = new SummaryService(prisma as unknown as PrismaService);
  });

  it('warns when business use is ~100% with no personal km', async () => {
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 100,
        platform: GigPlatform.NONE,
      },
    ]);

    const s = await service.getTaxYearSummary(userId, taxYear);

    expect(s.businessUsePercent).toBe(100);
    expect(s.personalKm).toBe(0);
    expect(s.warnUnrealisticBusinessUse).toBe(true);
    expect(s.warnPossibleDoubleCount).toBe(false);
    expect(s.usedOdometer).toBe(false);
    expect(s.odometerTotalKm).toBe(0);
  });

  it('warns when platform import and same-platform BUSINESS trips both exist', async () => {
    prisma.platformImport.findMany.mockResolvedValue([
      { platform: GigPlatform.UBER_EATS, reportedKm: 8500 },
    ]);
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 200,
        platform: GigPlatform.UBER_EATS,
      },
    ]);

    const s = await service.getTaxYearSummary(userId, taxYear);

    expect(s.businessKm).toBe(8700);
    expect(s.warnPossibleDoubleCount).toBe(true);
  });

  it('does not warn double-count when extra trips use NONE / different platform', async () => {
    prisma.platformImport.findMany.mockResolvedValue([
      { platform: GigPlatform.UBER_EATS, reportedKm: 8500 },
    ]);
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 48,
        platform: GigPlatform.NONE,
      },
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 100,
        platform: GigPlatform.INSTACART,
      },
    ]);

    const s = await service.getTaxYearSummary(userId, taxYear);

    expect(s.warnPossibleDoubleCount).toBe(false);
    expect(s.platformKmGap).toBe(148);
  });

  it('uses PERSONAL trips when fewer than 2 odometer readings', async () => {
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 80,
        platform: GigPlatform.NONE,
      },
      {
        purpose: TripPurpose.PERSONAL,
        kilometers: 20,
        platform: GigPlatform.NONE,
      },
    ]);
    prisma.odometerReading.findMany.mockResolvedValue([
      { date: new Date('2026-01-01'), reading: 10000 },
    ]);

    const s = await service.getTaxYearSummary(userId, taxYear);

    expect(s.totalKm).toBe(100);
    expect(s.personalKm).toBe(20);
    expect(s.businessUsePercent).toBe(80);
    expect(s.warnUnrealisticBusinessUse).toBe(false);
    expect(s.usedOdometer).toBe(false);
  });

  it('derives personal km from odometer when ≥2 readings exist', async () => {
    prisma.platformImport.findMany.mockResolvedValue([
      { platform: GigPlatform.UBER_EATS, reportedKm: 8000 },
    ]);
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 500,
        platform: GigPlatform.NONE,
      },
      {
        purpose: TripPurpose.PERSONAL,
        kilometers: 9999,
        platform: GigPlatform.NONE,
      },
    ]);
    prisma.odometerReading.findMany.mockResolvedValue([
      { date: new Date('2026-06-01'), reading: 15000 },
      { date: new Date('2026-01-01'), reading: 10000 },
      { date: new Date('2026-12-31'), reading: 20000 },
    ]);
    prisma.expense.findMany.mockResolvedValue([
      {
        amount: 100,
        category: ExpenseCategory.FUEL,
      },
    ]);

    const s = await service.getTaxYearSummary(userId, taxYear);

    expect(s.usedOdometer).toBe(true);
    expect(s.odometerTotalKm).toBe(10000);
    expect(s.businessKm).toBe(8500);
    expect(s.personalKm).toBe(1500);
    expect(s.totalKm).toBe(10000);
    expect(s.businessUsePercent).toBe(85);
    expect(s.deductibleExpenses).toBe(85);
    expect(s.warnUnrealisticBusinessUse).toBe(false);
    expect(s.warnPossibleDoubleCount).toBe(false);
  });

  it('caps business use at 100% when business km exceeds odometer total', async () => {
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 12000,
        platform: GigPlatform.NONE,
      },
    ]);
    prisma.odometerReading.findMany.mockResolvedValue([
      { date: new Date('2026-01-01'), reading: 10000 },
      { date: new Date('2026-12-31'), reading: 20000 },
    ]);

    const s = await service.getTaxYearSummary(userId, taxYear);

    expect(s.odometerTotalKm).toBe(10000);
    expect(s.personalKm).toBe(0);
    expect(s.businessUsePercent).toBe(100);
    expect(s.warnUnrealisticBusinessUse).toBe(true);
  });

  it('includes odometer and double-count fields in CSV export', async () => {
    prisma.odometerReading.findMany.mockResolvedValue([
      { date: new Date('2026-01-01'), reading: 0 },
      { date: new Date('2026-12-31'), reading: 1000 },
    ]);
    prisma.trip.findMany.mockResolvedValue([
      {
        purpose: TripPurpose.BUSINESS,
        kilometers: 400,
        platform: GigPlatform.NONE,
      },
    ]);

    const csv = await service.exportCsv(userId, taxYear);

    expect(csv).toContain('usedOdometer,true');
    expect(csv).toContain('odometerTotalKm,1000');
    expect(csv).toContain('personalKm,600');
    expect(csv).toContain('warnUnrealisticBusinessUse,false');
    expect(csv).toContain('warnPossibleDoubleCount,false');
  });
});
