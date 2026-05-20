import { Injectable } from '@nestjs/common';
import { PrismaClient, type PlatformImport } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertPlatformImportDto } from './dto/upsert-platform-import.dto';

@Injectable()
export class PlatformImportsService {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaClient {
    return this.prisma;
  }

  list(userId: string, taxYear: number): Promise<PlatformImport[]> {
    return this.prisma.platformImport.findMany({
      where: { userId, taxYear },
      orderBy: { platform: 'asc' },
    });
  }

  upsert(
    userId: string,
    dto: UpsertPlatformImportDto,
  ): Promise<PlatformImport> {
    return this.prisma.platformImport.upsert({
      where: {
        userId_taxYear_platform: {
          userId,
          taxYear: dto.taxYear,
          platform: dto.platform,
        },
      },
      create: {
        userId,
        taxYear: dto.taxYear,
        platform: dto.platform,
        reportedKm: dto.reportedKm,
        note: dto.note,
      },
      update: {
        reportedKm: dto.reportedKm,
        note: dto.note,
      },
    });
  }
}
