import { Controller, Get, Header, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SummaryService } from './summary.service';

@Controller('summary')
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summary: SummaryService) {}

  @Get()
  get(@CurrentUser('sub') userId: string, @Query('taxYear') taxYear?: string) {
    const year = parseInt(taxYear ?? '', 10) || new Date().getFullYear();
    return this.summary.getTaxYearSummary(userId, year);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="gigtax-summary.csv"')
  export(
    @CurrentUser('sub') userId: string,
    @Query('taxYear') taxYear?: string,
  ) {
    const year = parseInt(taxYear ?? '', 10) || new Date().getFullYear();
    return this.summary.exportCsv(userId, year);
  }
}
