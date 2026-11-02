import type { BadgeTone } from '@/components/ui/Badge';
import type { EnrollmentDisplayStatus } from '@/interfaces/enrollment.interface';
import type { PaymentStatus } from '@/interfaces/payment.interface';
import type { PlanStatus } from '@/interfaces/plan.interface';
import type { StudentStatus } from '@/interfaces/student.interface';
import type { EmployeeStatus } from '@/interfaces/employee.interface';
import type { IntegrationState } from '@/interfaces/settings.interface';

export const studentStatusTone: Record<StudentStatus, BadgeTone> = {
  active: 'success',
  inactive: 'neutral',
};

export const planStatusTone: Record<PlanStatus, BadgeTone> = {
  active: 'success',
  inactive: 'neutral',
};

export const enrollmentStatusTone: Record<EnrollmentDisplayStatus, BadgeTone> = {
  active: 'success',
  expiring: 'warning',
  expired: 'danger',
  cancelled: 'neutral',
};

export const paymentStatusTone: Record<PaymentStatus, BadgeTone> = {
  paid: 'success',
  pending: 'warning',
  late: 'danger',
  cancelled: 'neutral',
};

export const employeeStatusTone: Record<EmployeeStatus, BadgeTone> = {
  active: 'success',
  inactive: 'neutral',
};

export const integrationStatusTone: Record<IntegrationState['status'], BadgeTone> = {
  connected: 'success',
  disconnected: 'danger',
  not_configured: 'neutral',
};

export const integrationStatusLabels: Record<IntegrationState['status'], string> = {
  connected: 'Conectado',
  disconnected: 'Desconectado',
  not_configured: 'Não configurado',
};
