import { Module } from '@nestjs/common';
import { PlatformImportsController } from './platform-imports.controller';
import { PlatformImportsService } from './platform-imports.service';

@Module({
  controllers: [PlatformImportsController],
  providers: [PlatformImportsService],
})
export class PlatformImportsModule {}
