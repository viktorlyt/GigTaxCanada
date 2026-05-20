import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, taxYear?: number) {
    return this.prisma.expense.findMany({
      where: this.yearFilter(userId, taxYear),
      orderBy: { date: 'desc' },
    });
  }

  create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        date: new Date(dto.date),
        amount: dto.amount,
        category: dto.category,
        note: dto.note,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.assertOwner(userId, id);
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.note !== undefined && { note: dto.note }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.assertOwner(userId, id);
    return this.prisma.expense.delete({ where: { id } });
  }

  private async assertOwner(userId: string, id: string) {
    const row = await this.prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!row) throw new NotFoundException('Expense not found');
  }

  private yearFilter(userId: string, taxYear?: number) {
    if (!taxYear) return { userId };
    return {
      userId,
      date: {
        gte: new Date(`${taxYear}-01-01`),
        lte: new Date(`${taxYear}-12-31`),
      },
    };
  }
}
