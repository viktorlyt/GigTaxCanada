import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpsertPlatformImportDto } from './dto/upsert-platform-import.dto';
import { PlatformImportsService } from './platform-imports.service';

@Controller('platform-imports')
@UseGuards(JwtAuthGuard)
export class PlatformImportsController {
  constructor(private readonly imports: PlatformImportsService) {}

  @Get()
  list(@CurrentUser('sub') userId: string, @Query('taxYear') taxYear: string) {
    return this.imports.list(userId, parseInt(taxYear, 10));
  }

  @Post()
  upsert(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpsertPlatformImportDto,
  ) {
    return this.imports.upsert(userId, dto);
  }
}
