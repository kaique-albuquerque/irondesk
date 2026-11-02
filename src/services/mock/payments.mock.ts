import type { Enrollment } from '@/interfaces/enrollment.interface';
import type { Payment, PaymentMethod } from '@/interfaces/payment.interface';
import type { Plan } from '@/interfaces/plan.interface';
import { addDays, endOfMonth, lastMonthKeys, parseISODate, startOfMonth, todayISO } from '@/utils/date';
import { randomChance, randomInt, randomPick } from '@/utils/random';

const methods: PaymentMethod[] = ['pix', 'pix', 'pix', 'credit', 'debit', 'cash', 'transfer'];

export function buildPayments(enrollments: Enrollment[], plans: Plan[], today: string): Payment[] {
  const planMap = new Map(plans.map((plan) => [plan.id, plan]));
  const months = lastMonthKeys(6, parseISODate(today));
  const payments: Payment[] = [];

  enrollments.forEach((enrollment) => {
    const plan = planMap.get(enrollment.planId);
    if (!plan || plan.price === 0) return;
    const monthly = Number((enrollment.contractedValue / Math.max(1, plan.durationMonths)).toFixed(2));
    const dueDay = randomPick([5, 10, 15, 20]);
    const firstMonth = startOfMonth(enrollment.startDate).slice(0, 7);

    months.forEach((month) => {
      if (month < firstMonth) return;
      const dueDate = `${month}-${`${dueDay}`.padStart(2, '0')}`;
      if (dueDate > endOfMonth(today) && month !== months[months.length - 1]) return;
      const isCurrent = month === months[months.length - 1];
      const isFuture = dueDate > today;
      const cancelled = enrollment.status === 'cancelled' && !isCurrent;
      let status: Payment['status'] = 'pending';
      let paidAt: string | null = null;
      let method: PaymentMethod | null = null;

      if (cancelled) {
        status = 'cancelled';
      } else if (isFuture) {
        if (randomChance(0.15)) {
          status = 'paid';
          paidAt = addDays(dueDate, -randomInt(1, 5));
          method = randomPick(methods);
        }
      } else if (isCurrent ? randomChance(0.72) : randomChance(0.9)) {
        status = 'paid';
        paidAt = addDays(dueDate, randomInt(-4, 1));
        method = randomPick(methods);
      }

      payments.push({
        id: `pay_${enrollment.id}_${month}`,
        studentId: enrollment.studentId,
        enrollmentId: enrollment.id,
        amount: monthly,
        dueDate,
        paidAt: paidAt ? `${paidAt}T12:00:00.000Z` : null,
        method,
        status,
        description: `Mensalidade ${plan.name} — ${month}`,
        createdAt: `${startOfMonth(enrollment.startDate)}T09:00:00.000Z`,
      });
    });
  });

  return payments;
}

export function todayForSeed(): string {
  return todayISO();
}
