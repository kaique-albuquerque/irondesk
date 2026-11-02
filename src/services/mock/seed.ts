import { DATABASE_VERSION } from '@/constants/app';
import type { Database } from '@/interfaces/database.interface';
import { todayISO } from '@/utils/date';
import { resetRandom } from '@/utils/random';
import { buildAssessments } from './assessments.mock';
import { buildCheckins } from './checkins.mock';
import { buildEmployees } from './employees.mock';
import { buildEnrollments } from './enrollments.mock';
import { buildExpenses } from './expenses.mock';
import { buildPayments } from './payments.mock';
import { seedPlans } from './plans.mock';
import { seedSettings } from './settings.mock';
import { buildStudents } from './students.mock';
import { buildWorkouts } from './workouts.mock';

export function createSeedDatabase(): Database {
  resetRandom();
  const today = todayISO();
  const plans = structuredClone(seedPlans);
  const students = buildStudents(plans, today);
  const employees = buildEmployees(today);
  const enrollments = buildEnrollments(students, plans, today);
  const payments = buildPayments(enrollments, plans, today);
  const expenses = buildExpenses(today);
  const checkins = buildCheckins(students, today);
  const workouts = buildWorkouts(students, employees, today);
  const assessments = buildAssessments(students, employees);

  return {
    version: DATABASE_VERSION,
    createdAt: new Date().toISOString(),
    settings: structuredClone(seedSettings),
    plans,
    students,
    employees,
    enrollments,
    payments,
    expenses,
    checkins,
    workouts,
    assessments,
  };
}
