import { NotFoundException } from '@nestjs/common';
import { OdometerReadingsService } from './odometer-readings.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OdometerReadingsService', () => {
  const userId = 'user-1';

  let prisma: {
    odometerReading: {
      findMany: jest.Mock;
      upsert: jest.Mock;
      findFirst: jest.Mock;
      delete: jest.Mock;
    };
  };
  let service: OdometerReadingsService;

  beforeEach(() => {
    prisma = {
      odometerReading: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new OdometerReadingsService(prisma as unknown as PrismaService);
  });

  it('lists readings filtered by tax year', async () => {
    prisma.odometerReading.findMany.mockResolvedValue([]);

    await service.list(userId, 2026);

    expect(prisma.odometerReading.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        date: {
          gte: new Date('2026-01-01'),
          lte: new Date('2026-12-31'),
        },
      },
      orderBy: { date: 'asc' },
    });
  });

  it('upserts by userId + date', async () => {
    const row = { id: 'r1', reading: 12000 };
    prisma.odometerReading.upsert.mockResolvedValue(row);

    const result = await service.upsert(userId, {
      date: '2026-01-01',
      reading: 12000,
      note: 'year start',
    });

    expect(result).toBe(row);
    expect(prisma.odometerReading.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_date: { userId, date: new Date('2026-01-01') },
        },
        create: expect.objectContaining({
          userId,
          reading: 12000,
          note: 'year start',
        }),
        update: { reading: 12000, note: 'year start' },
      }),
    );
  });

  it('throws when deleting a reading owned by someone else', async () => {
    prisma.odometerReading.findFirst.mockResolvedValue(null);

    await expect(service.remove(userId, 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.odometerReading.delete).not.toHaveBeenCalled();
  });
});
