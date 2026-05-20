import { Controller, Get } from '@nestjs/common';
import { GigPlatform, PLATFORM_LABELS } from '@gigtax/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      ok: true,
      db: true,
      sample: PLATFORM_LABELS[GigPlatform.UBER_EATS],
    };
  }
}
