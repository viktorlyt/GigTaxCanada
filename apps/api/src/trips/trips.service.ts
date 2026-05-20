import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, taxYear?: number) {
    return this.prisma.trip.findMany({
      where: this.yearFilter(userId, taxYear),
      orderBy: { date: 'desc' },
    });
  }

  create(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        userId,
        date: new Date(dto.date),
        kilometers: dto.kilometers,
        purpose: dto.purpose,
        platform: dto.platform,
        note: dto.note,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTripDto) {
    await this.assertOwner(userId, id);
    return this.prisma.trip.update({
      where: { id },
      data: {
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.kilometers !== undefined && { kilometers: dto.kilometers }),
        ...(dto.purpose !== undefined && { purpose: dto.purpose }),
        ...(dto.platform !== undefined && { platform: dto.platform }),
        ...(dto.note !== undefined && { note: dto.note }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.assertOwner(userId, id);
    return this.prisma.trip.delete({ where: { id } });
  }

  private async assertOwner(userId: string, id: string) {
    const trip = await this.prisma.trip.findFirst({ where: { id, userId } });
    if (!trip) throw new NotFoundException('Trip not found');
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
