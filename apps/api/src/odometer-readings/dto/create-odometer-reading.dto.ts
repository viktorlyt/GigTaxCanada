import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOdometerReadingDto {
  @IsDateString()
  date!: string;

  @IsNumber()
  @Min(0)
  reading!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
