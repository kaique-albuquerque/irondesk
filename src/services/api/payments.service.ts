import type { Payment, PaymentView, PaymentInput, PaymentMethod } from '@/interfaces/payment.interface';
import { simulateLatency } from '@/services/api/helpers';
import { getDatabase, mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { todayISO } from '@/utils/date';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';
import { resolvePaymentStatus } from '@/utils/status';

function toView(payment: Payment): PaymentView {
  const database = getDatabase();
  const student = database.students.find((item) => item.id === payment.studentId);
  return {
    ...payment,
    studentName: student?.name ?? 'Aluno removido',
    displayStatus: resolvePaymentStatus(payment, todayISO()),
  };
}

export const paymentsService = {
  async list(): Promise<PaymentView[]> {
    await simulateLatency();
    return selectCollection('payments')
      .map(toView)
      .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  },

  async listByStudent(studentId: string): Promise<PaymentView[]> {
    await simulateLatency();
    return selectCollection('payments')
      .filter((payment) => payment.studentId === studentId)
      .map(toView)
      .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  },

  async create(input: PaymentInput): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.payments.push({
        ...input,
        id: createId('pay'),
        paidAt: input.status === 'paid' ? `${todayISO()}T12:00:00.000Z` : null,
        createdAt: todayISO(),
      });
    });
  },

  async register(id: string, method: PaymentMethod, paidAt: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      const payment = database.payments.find((item) => item.id === id);
      if (!payment) throw new AppError('Pagamento não encontrado.');
      payment.status = 'paid';
      payment.method = method;
      payment.paidAt = `${paidAt}T12:00:00.000Z`;
    });
  },

  async cancel(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      const payment = database.payments.find((item) => item.id === id);
      if (!payment) throw new AppError('Pagamento não encontrado.');
      if (payment.status === 'paid') throw new AppError('Pagamentos já liquidados não podem ser cancelados.');
      payment.status = 'cancelled';
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.payments = database.payments.filter((payment) => payment.id !== id);
    });
  },
};
