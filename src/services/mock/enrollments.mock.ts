import type { Enrollment } from '@/interfaces/enrollment.interface';
import type { Plan } from '@/interfaces/plan.interface';
import type { Student } from '@/interfaces/student.interface';
import { addDays, addMonths } from '@/utils/date';
import { random, randomChance, randomInt } from '@/utils/random';

function dueFor(plan: Plan, start: string): string {
  return plan.durationMonths === 0 ? addDays(start, 7) : addMonths(start, plan.durationMonths);
}

function startFor(plan: Plan, due: string): string {
  return plan.durationMonths === 0 ? addDays(due, -7) : addMonths(due, -plan.durationMonths);
}

export function buildEnrollments(students: Student[], plans: Plan[], today: string): Enrollment[] {
  const planMap = new Map(plans.map((plan) => [plan.id, plan]));
  const enrollments: Enrollment[] = [];

  students.forEach((student, index) => {
    const plan = student.planId ? planMap.get(student.planId) : undefined;
    if (!plan) return;
    const roll = random();
    let dueDate: string;
    let startDate: string;

    if (roll < 0.08) {
      dueDate = addDays(today, -randomInt(3, 40));
      startDate = startFor(plan, dueDate);
    } else if (roll < 0.22) {
      dueDate = addDays(today, randomInt(0, 7));
      startDate = startFor(plan, dueDate);
    } else if (plan.durationMonths <= 1) {
      startDate = addDays(student.createdAt, randomInt(0, 5));
      dueDate = dueFor(plan, startDate);
      if (dueDate < today) dueDate = addDays(today, randomInt(9, 24));
      if (dueDate < today) dueDate = addDays(today, 18);
      startDate = startFor(plan, dueDate);
    } else {
      startDate = addDays(today, -randomInt(4, 45));
      dueDate = dueFor(plan, startDate);
    }

    const discountPercent = randomChance(0.3) ? (randomChance(0.5) ? 5 : 10) : 0;
    const contractedValue = Number((plan.price * (1 - discountPercent / 100)).toFixed(2));

    enrollments.push({
      id: `enr_${`${index + 1}`.padStart(3, '0')}a`,
      studentId: student.id,
      planId: plan.id,
      startDate,
      dueDate,
      discountPercent,
      contractedValue,
      status: student.status === 'inactive' ? 'cancelled' : 'active',
      createdAt: `${startDate}T09:00:00.000Z`,
    });

    if (randomChance(0.28)) {
      const previousDue = addDays(student.createdAt, plan.durationMonths * 30);
      enrollments.push({
        id: `enr_${`${index + 1}`.padStart(3, '0')}b`,
        studentId: student.id,
        planId: plan.id,
        startDate: student.createdAt,
        dueDate: previousDue,
        discountPercent: 0,
        contractedValue: plan.price,
        status: 'cancelled',
        createdAt: `${student.createdAt}T09:00:00.000Z`,
      });
    }
  });

  return enrollments;
}
