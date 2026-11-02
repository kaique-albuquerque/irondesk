export type PaymentMethod = 'pix' | 'cash' | 'credit' | 'debit' | 'transfer';

export type PaymentRecordStatus = 'paid' | 'pending' | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'late' | 'cancelled';

export interface Payment {
  id: string;
  studentId: string;
  enrollmentId: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  method: PaymentMethod | null;
  status: PaymentRecordStatus;
  description: string;
  createdAt: string;
}

export interface PaymentView extends Payment {
  studentName: string;
  displayStatus: PaymentStatus;
}

export interface PaymentInput {
  studentId: string;
  enrollmentId: string;
  amount: number;
  dueDate: string;
  method: PaymentMethod | null;
  status: PaymentRecordStatus;
  description: string;
}

export type ExpenseCategory =
  | 'rent'
  | 'payroll'
  | 'equipment'
  | 'maintenance'
  | 'marketing'
  | 'utilities'
  | 'other';

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string;
}

export type ExpenseInput = Omit<Expense, 'id'>;
