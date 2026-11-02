import type { Expense, ExpenseInput } from '@/interfaces/payment.interface';
import { simulateLatency, sortBy } from '@/services/api/helpers';
import { mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';

export const expensesService = {
  async list(): Promise<Expense[]> {
    await simulateLatency();
    return sortBy(selectCollection('expenses'), (expense) => expense.date);
  },

  async create(input: ExpenseInput): Promise<Expense> {
    await simulateLatency();
    const expense: Expense = { ...input, id: createId('exp') };
    mutateDatabase((database) => {
      database.expenses.push(expense);
    });
    return expense;
  },

  async update(id: string, input: ExpenseInput): Promise<Expense> {
    await simulateLatency();
    return mutateDatabase((database) => {
      const index = database.expenses.findIndex((expense) => expense.id === id);
      if (index < 0) throw new AppError('Despesa não encontrada.');
      database.expenses[index] = { ...database.expenses[index], ...input };
      return database.expenses[index];
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.expenses = database.expenses.filter((expense) => expense.id !== id);
    });
  },
};
