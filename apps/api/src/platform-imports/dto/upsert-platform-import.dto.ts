import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GigPlatform } from '@prisma/client';

export class UpsertPlatformImportDto {
  @IsInt()
  @Min(2020)
  @Max(2100)
  taxYear!: number;

  @IsEnum(GigPlatform)
  platform!: GigPlatform;

  @IsNumber()
  @Min(0)
  reportedKm!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
