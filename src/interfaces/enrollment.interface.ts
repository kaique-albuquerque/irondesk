export type EnrollmentRecordStatus = 'active' | 'cancelled';

export type EnrollmentDisplayStatus = 'active' | 'expiring' | 'expired' | 'cancelled';

export interface Enrollment {
  id: string;
  studentId: string;
  planId: string;
  startDate: string;
  dueDate: string;
  discountPercent: number;
  contractedValue: number;
  status: EnrollmentRecordStatus;
  createdAt: string;
}

export interface EnrollmentView extends Enrollment {
  studentName: string;
  planName: string;
  displayStatus: EnrollmentDisplayStatus;
  daysLeft: number;
}

export interface EnrollmentInput {
  studentId: string;
  planId: string;
  startDate: string;
  discountPercent: number;
}
