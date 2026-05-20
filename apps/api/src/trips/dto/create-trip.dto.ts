import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GigPlatform, TripPurpose } from '@prisma/client';

export class CreateTripDto {
  @IsDateString()
  date!: string;

  @IsNumber()
  @Min(0.1)
  kilometers!: number;

  @IsEnum(TripPurpose)
  purpose!: TripPurpose;

  @IsEnum(GigPlatform)
  platform!: GigPlatform;

  @IsOptional()
  @IsString()
  note?: string;
}
