import type { Enrollment, EnrollmentInput, EnrollmentView } from '@/interfaces/enrollment.interface';
import type { Plan } from '@/interfaces/plan.interface';
import { simulateLatency } from '@/services/api/helpers';
import { getDatabase, mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { addDays, addMonths, daysBetween, todayISO } from '@/utils/date';
import { AppError } from '@/utils/errors';
import { computeContractedValue, computeDueDate } from '@/utils/enrollment';
import { createId } from '@/utils/id';
import { resolveEnrollmentStatus } from '@/utils/status';

function toView(enrollment: Enrollment): EnrollmentView {
  const database = getDatabase();
  const student = database.students.find((item) => item.id === enrollment.studentId);
  const plan = database.plans.find((item) => item.id === enrollment.planId);
  const today = todayISO();
  return {
    ...enrollment,
    studentName: student?.name ?? 'Aluno removido',
    planName: plan?.name ?? 'Plano removido',
    displayStatus: resolveEnrollmentStatus(
      enrollment.status,
      enrollment.dueDate,
      today,
      database.settings.notifyExpiringDays,
    ),
    daysLeft: daysBetween(today, enrollment.dueDate),
  };
}

function buildEnrollment(input: EnrollmentInput, plan: Plan): Enrollment {
  return {
    id: createId('enr'),
    studentId: input.studentId,
    planId: input.planId,
    startDate: input.startDate,
    dueDate: computeDueDate(plan, input.startDate),
    discountPercent: input.discountPercent,
    contractedValue: computeContractedValue(plan, input.discountPercent),
    status: 'active',
    createdAt: todayISO(),
  };
}

function assertNoActive(studentId: string): void {
  const hasActive = selectCollection('enrollments').some(
    (enrollment) => enrollment.studentId === studentId && enrollment.status === 'active',
  );
  if (hasActive) throw new AppError('Este aluno já possui uma matrícula ativa.');
}

export const enrollmentsService = {
  async list(): Promise<EnrollmentView[]> {
    await simulateLatency();
    return selectCollection('enrollments')
      .map(toView)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  },

  async listByStudent(studentId: string): Promise<EnrollmentView[]> {
    await simulateLatency();
    return selectCollection('enrollments')
      .filter((enrollment) => enrollment.studentId === studentId)
      .map(toView)
      .sort((a, b) => b.startDate.localeCompare(a.startDate));
  },

  async create(input: EnrollmentInput): Promise<Enrollment> {
    await simulateLatency();
    const plan = selectCollection('plans').find((item) => item.id === input.planId);
    if (!plan) throw new AppError('Selecione um plano válido.');
    assertNoActive(input.studentId);
    const enrollment = buildEnrollment(input, plan);
    mutateDatabase((database) => {
      database.enrollments.push(enrollment);
      const student = database.students.find((item) => item.id === input.studentId);
      if (student) {
        student.planId = plan.id;
        student.status = 'active';
      }
    });
    return enrollment;
  },

  async renew(id: string): Promise<Enrollment> {
    await simulateLatency();
    return mutateDatabase((database) => {
      const enrollment = database.enrollments.find((item) => item.id === id);
      if (!enrollment) throw new AppError('Matrícula não encontrada.');
      const plan = database.plans.find((item) => item.id === enrollment.planId);
      if (!plan) throw new AppError('Plano da matrícula não encontrado.');
      const base = enrollment.dueDate > todayISO() ? enrollment.dueDate : todayISO();
      enrollment.startDate = base;
      enrollment.dueDate = plan.durationMonths === 0 ? addDays(base, 7) : addMonths(base, plan.durationMonths);
      enrollment.status = 'active';
      return enrollment;
    });
  },

  async changePlan(id: string, planId: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      const enrollment = database.enrollments.find((item) => item.id === id);
      if (!enrollment) throw new AppError('Matrícula não encontrada.');
      const plan = database.plans.find((item) => item.id === planId);
      if (!plan) throw new AppError('Plano não encontrado.');
      enrollment.status = 'cancelled';
      const next = buildEnrollment(
        { studentId: enrollment.studentId, planId, startDate: todayISO(), discountPercent: 0 },
        plan,
      );
      database.enrollments.push(next);
      const student = database.students.find((item) => item.id === enrollment.studentId);
      if (student) student.planId = planId;
    });
  },

  async cancel(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      const enrollment = database.enrollments.find((item) => item.id === id);
      if (!enrollment) throw new AppError('Matrícula não encontrada.');
      enrollment.status = 'cancelled';
      database.payments.forEach((payment) => {
        if (payment.enrollmentId === id && payment.status === 'pending' && payment.dueDate >= todayISO()) {
          payment.status = 'cancelled';
        }
      });
    });
  },
};
