import type { ToastTone } from '@/types/toast';
import { selectCollection } from '@/services/storage/database.service';
import { daysBetween, todayISO } from '@/utils/date';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  to: string;
  tone: ToastTone;
}

export function buildNotifications(): NotificationItem[] {
  const today = todayISO();
  const payments = selectCollection('payments');
  const enrollments = selectCollection('enrollments');
  const students = selectCollection('students');
  const nameOf = (id: string) => students.find((student) => student.id === id)?.name ?? 'Aluno';

  const late = payments.filter((payment) => payment.status === 'pending' && payment.dueDate < today);
  const dueToday = payments.filter((payment) => payment.status === 'pending' && payment.dueDate === today);
  const expiring = enrollments.filter((enrollment) => {
    if (enrollment.status !== 'active') return false;
    const days = daysBetween(today, enrollment.dueDate);
    return days >= 0 && days <= 7;
  });

  const items: NotificationItem[] = [
    ...late.slice(0, 3).map((payment) => ({
      id: payment.id,
      title: `Mensalidade em atraso · ${nameOf(payment.studentId)}`,
      description: `Vencimento em ${payment.dueDate.split('-').reverse().join('/')}`,
      to: '/financeiro',
      tone: 'error' as ToastTone,
    })),
    ...dueToday.slice(0, 2).map((payment) => ({
      id: payment.id,
      title: `Vence hoje · ${nameOf(payment.studentId)}`,
      description: 'Mensalidade com vencimento para hoje',
      to: '/financeiro',
      tone: 'info' as ToastTone,
    })),
    ...expiring.slice(0, 3).map((enrollment) => ({
      id: enrollment.id,
      title: `Matrícula a vencer · ${nameOf(enrollment.studentId)}`,
      description: 'Renove para manter o acesso liberado',
      to: '/matriculas',
      tone: 'info' as ToastTone,
    })),
  ];

  return items;
}
