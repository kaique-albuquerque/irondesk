import type { DistributionSlice, MonthSeriesPoint } from './dashboard.interface';

export interface ReportTotals {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  tickets: number;
  averageTicket: number;
}

export interface PlanPerformance {
  name: string;
  students: number;
  revenue: number;
}

export interface StudentRanking {
  id: string;
  name: string;
  checkins: number;
}

export interface ReportData {
  series: MonthSeriesPoint[];
  methods: DistributionSlice[];
  categories: DistributionSlice[];
  plans: PlanPerformance[];
  topStudents: StudentRanking[];
  totals: ReportTotals;
}
