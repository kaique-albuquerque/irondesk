import type { Student } from '@/interfaces/student.interface';
import type { Plan } from '@/interfaces/plan.interface';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import type { PaymentView } from '@/interfaces/payment.interface';
import type { WorkoutView } from '@/interfaces/workout.interface';
import type { AssessmentView } from '@/interfaces/assessment.interface';
import type { CheckinView } from '@/interfaces/checkin.interface';
import { studentsService } from '@/services/api/students.service';
import { plansService } from '@/services/api/plans.service';
import { enrollmentsService } from '@/services/api/enrollments.service';
import { paymentsService } from '@/services/api/payments.service';
import { workoutsService } from '@/services/api/workouts.service';
import { assessmentsService } from '@/services/api/assessments.service';
import { checkinsService } from '@/services/api/checkins.service';

export interface StudentDetail {
  student: Student;
  plan: Plan | null;
  plans: Plan[];
  enrollments: EnrollmentView[];
  payments: PaymentView[];
  workouts: WorkoutView[];
  assessments: AssessmentView[];
  checkins: CheckinView[];
}

export const studentDetailService = {
  async get(id: string): Promise<StudentDetail | null> {
    const student = await studentsService.get(id);
    if (!student) return null;

    const [plans, enrollments, payments, workouts, assessments, checkins] = await Promise.all([
      plansService.list(),
      enrollmentsService.listByStudent(id),
      paymentsService.listByStudent(id),
      workoutsService.listByStudent(id),
      assessmentsService.listByStudent(id),
      checkinsService.listByStudent(id),
    ]);

    return {
      student,
      plan: plans.find((plan) => plan.id === student.planId) ?? null,
      plans,
      enrollments,
      payments,
      workouts,
      assessments,
      checkins,
    };
  },
};
