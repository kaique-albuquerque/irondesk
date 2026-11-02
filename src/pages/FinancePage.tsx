import { useMemo, useState } from 'react';
import type { Expense, PaymentView } from '@/interfaces/payment.interface';
import { paymentsService } from '@/services/api/payments.service';
import { expensesService } from '@/services/api/expenses.service';
import { studentsService } from '@/services/api/students.service';
import { enrollmentsService } from '@/services/api/enrollments.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { FinanceKpis } from '@/components/finance/FinanceKpis';
import { PaymentsPanel } from '@/components/finance/PaymentsPanel';
import { ExpensesPanel } from '@/components/finance/ExpensesPanel';
import {
  addMonths,
  endOfMonth,
  formatMonthLong,
  isWithin,
  monthKey,
  startOfMonth,
  todayISO,
} from '@/utils/date';

type FinanceTab = 'payments' | 'expenses';
type Period = 'month' | 'last' | 'all';

export function FinancePage() {
  const { data, loading, reload } = useAsyncData(async () => {
    const [payments, expenses, students, enrollments] = await Promise.all([
      paymentsService.list(),
      expensesService.list(),
      studentsService.list(),
      enrollmentsService.list(),
    ]);
    return { payments, expenses, students, enrollments };
  });

  const [tab, setTab] = useState<FinanceTab>('payments');
  const [period, setPeriod] = useState<Period>('month');

  const range = useMemo(() => {
    const today = todayISO();
    if (period === 'all') return null;
    const base = period === 'month' ? today : addMonths(today, -1);
    return { from: startOfMonth(base), to: endOfMonth(base) };
  }, [period]);

  const payments = data?.payments ?? [];
  const expenses = data?.expenses ?? [];

  const filteredPayments = useMemo<PaymentView[]>(
    () => (range ? payments.filter((item) => isWithin(item.dueDate, range.from, range.to)) : payments),
    [payments, range],
  );
  const filteredExpenses = useMemo<Expense[]>(
    () => (range ? expenses.filter((item) => isWithin(item.date, range.from, range.to)) : expenses),
    [expenses, range],
  );

  const periodLabel = range ? formatMonthLong(monthKey(range.from)) : 'Todo o período';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Financeiro"
        description="Receitas, despesas, inadimplência e conciliação de pagamentos"
        actions={
          <Select
            aria-label="Selecionar período"
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            options={[
              { value: 'month', label: 'Mês atual' },
              { value: 'last', label: 'Mês anterior' },
              { value: 'all', label: 'Todo o período' },
            ]}
            className="w-44"
          />
        }
      />

      <FinanceKpis payments={filteredPayments} expenses={filteredExpenses} periodLabel={periodLabel} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs
          items={[
            { value: 'payments', label: 'Contas a receber', count: filteredPayments.length },
            { value: 'expenses', label: 'Despesas', count: filteredExpenses.length },
          ]}
          value={tab}
          onChange={setTab}
        />
        <p className="text-xs text-subtle">
          {periodLabel} · {data?.students.length ?? 0} alunos cadastrados
        </p>
      </div>

      {tab === 'payments' ? (
        <PaymentsPanel
          payments={filteredPayments}
          students={data?.students ?? []}
          enrollments={data?.enrollments ?? []}
          loading={loading}
          onChange={reload}
        />
      ) : (
        <ExpensesPanel expenses={filteredExpenses} loading={loading} onChange={reload} />
      )}
    </div>
  );
}
