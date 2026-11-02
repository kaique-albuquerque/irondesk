import type { Assessment } from './assessment.interface';
import type { Checkin } from './checkin.interface';
import type { Employee } from './employee.interface';
import type { Enrollment } from './enrollment.interface';
import type { Expense, Payment } from './payment.interface';
import type { Plan } from './plan.interface';
import type { Settings } from './settings.interface';
import type { Student } from './student.interface';
import type { Workout } from './workout.interface';

export interface Database {
  version: number;
  createdAt: string;
  settings: Settings;
  students: Student[];
  plans: Plan[];
  employees: Employee[];
  enrollments: Enrollment[];
  payments: Payment[];
  expenses: Expense[];
  checkins: Checkin[];
  workouts: Workout[];
  assessments: Assessment[];
}

export type CollectionKey =
  | 'students'
  | 'plans'
  | 'employees'
  | 'enrollments'
  | 'payments'
  | 'expenses'
  | 'checkins'
  | 'workouts'
  | 'assessments';
