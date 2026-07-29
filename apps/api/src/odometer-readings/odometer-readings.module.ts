import { Module } from '@nestjs/common';
import { OdometerReadingsController } from './odometer-readings.controller';
import { OdometerReadingsService } from './odometer-readings.service';

@Module({
  controllers: [OdometerReadingsController],
  providers: [OdometerReadingsService],
})
export class OdometerReadingsModule {}
