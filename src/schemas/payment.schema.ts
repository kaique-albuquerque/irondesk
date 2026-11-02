import { z } from 'zod';
import type { ExpenseInput, PaymentInput } from '@/interfaces/payment.interface';

export const paymentSchema = z.object({
  studentId: z.string().min(1, 'Selecione o aluno'),
  amount: z.number({ invalid_type_error: 'Informe o valor' }).positive('O valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Informe o vencimento'),
  description: z.string().trim().min(3, 'Descreva o lançamento'),
  method: z.enum(['pix', 'cash', 'credit', 'debit', 'transfer']).nullable(),
  status: z.enum(['paid', 'pending', 'cancelled']),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const paymentDefaults: PaymentFormValues = {
  studentId: '',
  amount: 0,
  dueDate: '',
  description: 'Mensalidade',
  method: 'pix',
  status: 'pending',
};

export function toPaymentInput(values: PaymentFormValues, enrollmentId: string): PaymentInput {
  return {
    studentId: values.studentId,
    enrollmentId,
    amount: Number(values.amount.toFixed(2)),
    dueDate: values.dueDate,
    description: values.description.trim(),
    method: values.method,
    status: values.status,
  };
}

export const expenseSchema = z.object({
  description: z.string().trim().min(3, 'Descreva a despesa'),
  category: z.enum(['rent', 'payroll', 'equipment', 'maintenance', 'marketing', 'utilities', 'other']),
  amount: z.number({ invalid_type_error: 'Informe o valor' }).positive('O valor deve ser maior que zero'),
  date: z.string().min(1, 'Informe a data'),
  notes: z.string(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const expenseDefaults: ExpenseFormValues = {
  description: '',
  category: 'other',
  amount: 0,
  date: '',
  notes: '',
};

export function toExpenseInput(values: ExpenseFormValues): ExpenseInput {
  return {
    description: values.description.trim(),
    category: values.category,
    amount: Number(values.amount.toFixed(2)),
    date: values.date,
    notes: values.notes.trim(),
  };
}
