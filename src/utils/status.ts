import type { EnrollmentDisplayStatus } from '@/interfaces/enrollment.interface';
import type { PaymentStatus } from '@/interfaces/payment.interface';
import { daysBetween } from './date';

export function resolveEnrollmentStatus(
  status: 'active' | 'cancelled',
  dueDate: string,
  today: string,
  notifyDays: number,
): EnrollmentDisplayStatus {
  if (status === 'cancelled') return 'cancelled';
  const daysLeft = daysBetween(today, dueDate);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= notifyDays) return 'expiring';
  return 'active';
}

export function resolvePaymentStatus(
  payment: { status: 'paid' | 'pending' | 'cancelled'; dueDate: string },
  today: string,
): PaymentStatus {
  if (payment.status === 'cancelled') return 'cancelled';
  if (payment.status === 'paid') return 'paid';
  return payment.dueDate < today ? 'late' : 'pending';
}

export function daysUntil(dueDate: string, today: string): number {
  return daysBetween(today, dueDate);
}

export function enrollmentDurationLabel(daysLeft: number): string {
  if (daysLeft < 0) return `Vencida há ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'dia' : 'dias'}`;
  if (daysLeft === 0) return 'Vence hoje';
  return `Vence em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`;
}
