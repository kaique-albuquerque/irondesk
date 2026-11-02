import { chartPalette } from '@/constants/tones';
import type { CountSeriesPoint, DashboardData, DayFrequencyPoint, MonthSeriesPoint } from '@/interfaces/dashboard.interface';
import type { CheckinView } from '@/interfaces/checkin.interface';
import type { Enrollment } from '@/interfaces/enrollment.interface';
import type { Expense, Payment } from '@/interfaces/payment.interface';
import type { Plan } from '@/interfaces/plan.interface';
import type { Student } from '@/interfaces/student.interface';
import { checkinsService } from '@/services/api/checkins.service';
import { enrollmentsService } from '@/services/api/enrollments.service';
import { paymentsService } from '@/services/api/payments.service';
import { selectCollection } from '@/services/storage/database.service';
import { endOfMonth, formatMonthShort, lastMonthKeys, monthKey, todayISO } from '@/utils/date';

function sumPaid(payments: Payment[], month: string): number {
  return payments
    .filter((payment) => payment.status === 'paid' && payment.paidAt && monthKey(payment.paidAt) === month)
    .reduce((total, payment) => total + payment.amount, 0);
}

function sumExpenses(expenses: Expense[], month: string): number {
  return expenses
    .filter((expense) => monthKey(expense.date) === month)
    .reduce((total, expense) => total + expense.amount, 0);
}

function buildRevenueSeries(payments: Payment[], expenses: Expense[], months: string[]): MonthSeriesPoint[] {
  return months.map((month) => ({
    month: formatMonthShort(month),
    receita: sumPaid(payments, month),
    despesas: sumExpenses(expenses, month),
  }));
}

function buildStudentsSeries(students: Student[], months: string[]): CountSeriesPoint[] {
  return months.map((month) => ({
    month: formatMonthShort(month),
    alunos: students.filter((student) => student.createdAt <= endOfMonth(`${month}-01`)).length,
  }));
}

function buildPlanDistribution(plans: Plan[], enrollments: Enrollment[]) {
  return plans
    .map((plan, index) => ({
      name: plan.name,
      value: enrollments.filter((item) => item.planId === plan.id && item.status === 'active').length,
      color: chartPalette[index % chartPalette.length],
    }))
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value);
}

function buildWeeklyFrequency(checkins: CheckinView[]): DayFrequencyPoint[] {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const key = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
    const label = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    return { day: label, checkins: checkins.filter((checkin) => checkin.date === key).length };
  });
}

export const dashboardService = {
  async get(): Promise<DashboardData> {
    const [checkins, enrollments, paymentViews] = await Promise.all([
      checkinsService.list(),
      enrollmentsService.list(),
      paymentsService.list(),
    ]);
    const students = selectCollection('students');
    const payments = selectCollection('payments');
    const expenses = selectCollection('expenses');
    const plans = selectCollection('plans');
    const today = todayISO();
    const months = lastMonthKeys(6);
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2] ?? currentMonth;
    const monthlyRevenue = sumPaid(payments, currentMonth);
    const previousRevenue = sumPaid(payments, previousMonth);
    const late = paymentViews.filter((payment) => payment.displayStatus === 'late');
    const paidThisMonth = paymentViews.filter(
      (payment) => payment.displayStatus === 'paid' && payment.paidAt && monthKey(payment.paidAt) === currentMonth,
    );

    return {
      activeStudents: students.filter((student) => student.status === 'active').length,
      totalStudents: students.length,
      newStudentsThisMonth: students.filter((student) => monthKey(student.createdAt) === currentMonth).length,
      activeEnrollments: enrollments.filter((enrollment) => enrollment.status === 'active').length,
      monthlyRevenue,
      revenueGrowth: previousRevenue === 0 ? 0 : ((monthlyRevenue - previousRevenue) / previousRevenue) * 100,
      overdueAmount: late.reduce((total, payment) => total + payment.amount, 0),
      overdueCount: late.length,
      expiringCount: enrollments.filter((enrollment) => enrollment.displayStatus === 'expiring').length,
      checkinsToday: checkins.filter((checkin) => checkin.date === today).length,
      activeNow: checkins.filter((checkin) => checkin.date === today && !checkin.checkOutAt).length,
      averageTicket:
        paidThisMonth.length === 0
          ? 0
          : paidThisMonth.reduce((total, payment) => total + payment.amount, 0) / paidThisMonth.length,
      revenueSeries: buildRevenueSeries(payments, expenses, months),
      studentsSeries: buildStudentsSeries(students, months),
      planDistribution: buildPlanDistribution(plans, selectCollection('enrollments')),
      weeklyFrequency: buildWeeklyFrequency(checkins),
      recentCheckins: checkins.slice(0, 6),
      upcomingPayments: paymentViews
        .filter((payment) => payment.displayStatus === 'pending' || payment.displayStatus === 'late')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 5),
      expiringEnrollments: enrollments.filter((enrollment) => enrollment.displayStatus === 'expiring').slice(0, 5),
    };
  },
};
