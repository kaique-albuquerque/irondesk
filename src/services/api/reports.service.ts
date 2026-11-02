import { chartPalette } from '@/constants/tones';
import { expenseCategoryLabels, paymentMethodLabels, toOptions } from '@/constants/labels';
import { simulateLatency } from '@/services/api/helpers';
import { selectCollection } from '@/services/storage/database.service';
import type { ReportData } from '@/interfaces/reports.interface';
import { formatMonthShort, lastMonthKeys, monthKey } from '@/utils/date';

const methodColors = toOptions(paymentMethodLabels).map((option, index) => ({
  key: option.value,
  label: option.label,
  color: chartPalette[index % chartPalette.length],
}));

export const reportsService = {
  async get(monthsBack: number): Promise<ReportData> {
    await simulateLatency();
    const months = lastMonthKeys(monthsBack);
    const payments = selectCollection('payments');
    const expenses = selectCollection('expenses');
    const plans = selectCollection('plans');
    const enrollments = selectCollection('enrollments');
    const students = selectCollection('students');
    const checkins = selectCollection('checkins');
    const inRange = (value: string) => months.includes(monthKey(value));

    const paid = payments.filter(
      (payment) => payment.status === 'paid' && payment.paidAt && inRange(payment.paidAt),
    );
    const rangeExpenses = expenses.filter((expense) => inRange(expense.date));
    const revenue = paid.reduce((total, payment) => total + payment.amount, 0);
    const expenseTotal = rangeExpenses.reduce((total, expense) => total + expense.amount, 0);

    const series = months.map((month) => ({
      month: formatMonthShort(month),
      receita: paid
        .filter((payment) => payment.paidAt && monthKey(payment.paidAt) === month)
        .reduce((total, payment) => total + payment.amount, 0),
      despesas: rangeExpenses
        .filter((expense) => monthKey(expense.date) === month)
        .reduce((total, expense) => total + expense.amount, 0),
    }));

    const methods = methodColors
      .map((method) => ({
        name: method.label,
        value: paid
          .filter((payment) => payment.method === method.key)
          .reduce((total, payment) => total + payment.amount, 0),
        color: method.color,
      }))
      .filter((slice) => slice.value > 0);

    const categories = toOptions(expenseCategoryLabels)
      .map((option, index) => ({
        name: option.label,
        value: rangeExpenses
          .filter((expense) => expense.category === option.value)
          .reduce((total, expense) => total + expense.amount, 0),
        color: chartPalette[index % chartPalette.length],
      }))
      .filter((slice) => slice.value > 0)
      .sort((a, b) => b.value - a.value);

    const planPerformance = plans
      .map((plan) => {
        const planEnrollments = enrollments.filter((enrollment) => enrollment.planId === plan.id);
        return {
          name: plan.name,
          students: planEnrollments.filter((enrollment) => enrollment.status === 'active').length,
          revenue: planEnrollments
            .filter((enrollment) => enrollment.status === 'active')
            .reduce((total, enrollment) => total + enrollment.contractedValue, 0),
        };
      })
      .sort((a, b) => b.students - a.students);

    const topStudents = students
      .map((student) => ({
        id: student.id,
        name: student.name,
        checkins: checkins.filter((checkin) => checkin.studentId === student.id).length,
      }))
      .sort((a, b) => b.checkins - a.checkins)
      .slice(0, 8);

    return {
      series,
      methods,
      categories,
      plans: planPerformance,
      topStudents,
      totals: {
        revenue,
        expenses: expenseTotal,
        profit: revenue - expenseTotal,
        margin: revenue === 0 ? 0 : ((revenue - expenseTotal) / revenue) * 100,
        tickets: paid.length,
        averageTicket: paid.length === 0 ? 0 : revenue / paid.length,
      },
    };
  },
};
