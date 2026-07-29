import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateOdometerReadingDto } from './dto/create-odometer-reading.dto';
import { OdometerReadingsService } from './odometer-readings.service';

@Controller('odometer-readings')
@UseGuards(JwtAuthGuard)
export class OdometerReadingsController {
  constructor(private readonly odometer: OdometerReadingsService) {}

  @Get()
  list(@CurrentUser('sub') userId: string, @Query('taxYear') taxYear?: string) {
    return this.odometer.list(
      userId,
      taxYear ? parseInt(taxYear, 10) : undefined,
    );
  }

  @Post()
  upsert(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateOdometerReadingDto,
  ) {
    return this.odometer.upsert(userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.odometer.remove(userId, id);
  }
}
