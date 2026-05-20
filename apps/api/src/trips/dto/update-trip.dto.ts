import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GigPlatform, TripPurpose } from '@prisma/client';

export class UpdateTripDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  kilometers?: number;

  @IsOptional()
  @IsEnum(TripPurpose)
  purpose?: TripPurpose;

  @IsOptional()
  @IsEnum(GigPlatform)
  platform?: GigPlatform;

  @IsOptional()
  @IsString()
  note?: string;
}
