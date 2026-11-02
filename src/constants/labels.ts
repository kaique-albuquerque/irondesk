import type { BillingCycle, PlanStatus } from '@/interfaces/plan.interface';
import type { EnrollmentDisplayStatus } from '@/interfaces/enrollment.interface';
import type { EmployeeRole, EmployeeStatus } from '@/interfaces/employee.interface';
import type { ExpenseCategory, PaymentMethod, PaymentStatus } from '@/interfaces/payment.interface';
import type { MuscleGroup } from '@/interfaces/workout.interface';
import type { StudentStatus } from '@/interfaces/student.interface';
import type { SelectOption } from '@/types/common';

export const studentStatusLabels: Record<StudentStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const planStatusLabels: Record<PlanStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const enrollmentStatusLabels: Record<EnrollmentDisplayStatus, string> = {
  active: 'Ativa',
  expiring: 'Vencendo',
  expired: 'Vencida',
  cancelled: 'Cancelada',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  late: 'Atrasado',
  cancelled: 'Cancelado',
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: 'PIX',
  cash: 'Dinheiro',
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
  transfer: 'Transferência',
};

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  rent: 'Aluguel',
  payroll: 'Folha de pagamento',
  equipment: 'Equipamentos',
  maintenance: 'Manutenção',
  marketing: 'Marketing',
  utilities: 'Contas e utilidades',
  other: 'Outros',
};

export const employeeRoleLabels: Record<EmployeeRole, string> = {
  professor: 'Professor',
  personal: 'Personal trainer',
  receptionist: 'Recepcionista',
  manager: 'Gerente',
  admin: 'Administrador',
};

export const employeeStatusLabels: Record<EmployeeStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  legs: 'Pernas',
  abs: 'Abdômen',
  cardio: 'Cardio',
};

export const billingCycleLabels: Record<BillingCycle, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual',
  trial: 'Experimental',
  custom: 'Personalizado',
};

export function toOptions<T extends string>(labels: Record<T, string>): SelectOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

export const paymentMethodOptions = toOptions(paymentMethodLabels);
export const expenseCategoryOptions = toOptions(expenseCategoryLabels);
export const employeeRoleOptions = toOptions(employeeRoleLabels);
export const billingCycleOptions = toOptions(billingCycleLabels);
export const muscleGroupOptions = toOptions(muscleGroupLabels);
export const studentStatusOptions = toOptions(studentStatusLabels);
