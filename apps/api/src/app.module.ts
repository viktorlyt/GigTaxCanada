import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TripsModule } from './trips/trips.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SummaryModule } from './summary/summary.module';
import { PlatformImportsModule } from './platform-imports/platform-imports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TripsModule,
    ExpensesModule,
    SummaryModule,
    PlatformImportsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
