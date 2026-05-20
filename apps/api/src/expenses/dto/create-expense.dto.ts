import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ExpenseCategory } from '@prisma/client';

export class CreateExpenseDto {
  @IsDateString()
  date!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsEnum(ExpenseCategory)
  category!: ExpenseCategory;

  @IsOptional()
  @IsString()
  note?: string;
}
