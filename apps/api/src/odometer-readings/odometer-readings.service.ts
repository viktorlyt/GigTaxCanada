import { Injectable, NotFoundException } from '@nestjs/common';
import { type OdometerReading } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOdometerReadingDto } from './dto/create-odometer-reading.dto';

@Injectable()
export class OdometerReadingsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, taxYear?: number): Promise<OdometerReading[]> {
    return this.prisma.odometerReading.findMany({
      where: this.yearFilter(userId, taxYear),
      orderBy: { date: 'asc' },
    });
  }

  upsert(
    userId: string,
    dto: CreateOdometerReadingDto,
  ): Promise<OdometerReading> {
    const date = new Date(dto.date);
    return this.prisma.odometerReading.upsert({
      where: {
        userId_date: { userId, date },
      },
      create: {
        userId,
        date,
        reading: dto.reading,
        note: dto.note,
      },
      update: {
        reading: dto.reading,
        note: dto.note,
      },
    });
  }

  async remove(userId: string, id: string): Promise<OdometerReading> {
    await this.assertOwner(userId, id);
    return this.prisma.odometerReading.delete({ where: { id } });
  }

  private async assertOwner(userId: string, id: string) {
    const row = await this.prisma.odometerReading.findFirst({
      where: { id, userId },
    });
    if (!row) throw new NotFoundException('Odometer reading not found');
  }

  private yearFilter(userId: string, taxYear?: number) {
    if (!taxYear) return { userId };
    return {
      userId,
      date: {
        gte: new Date(`${taxYear}-01-01`),
        lte: new Date(`${taxYear}-12-31`),
      },
    };
  }
}
