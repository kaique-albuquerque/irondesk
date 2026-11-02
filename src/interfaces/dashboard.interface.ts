import type { CheckinView } from './checkin.interface';
import type { EnrollmentView } from './enrollment.interface';
import type { PaymentView } from './payment.interface';

export interface MonthSeriesPoint {
  month: string;
  receita: number;
  despesas: number;
}

export interface CountSeriesPoint {
  month: string;
  alunos: number;
}

export interface DistributionSlice {
  name: string;
  value: number;
  color: string;
}

export interface DayFrequencyPoint {
  day: string;
  checkins: number;
}

export interface DashboardData {
  activeStudents: number;
  totalStudents: number;
  newStudentsThisMonth: number;
  activeEnrollments: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  overdueAmount: number;
  overdueCount: number;
  expiringCount: number;
  checkinsToday: number;
  activeNow: number;
  averageTicket: number;
  revenueSeries: MonthSeriesPoint[];
  studentsSeries: CountSeriesPoint[];
  planDistribution: DistributionSlice[];
  weeklyFrequency: DayFrequencyPoint[];
  recentCheckins: CheckinView[];
  upcomingPayments: PaymentView[];
  expiringEnrollments: EnrollmentView[];
}
