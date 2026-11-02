import { ArrowDownCircle, ArrowUpCircle, Scale, Wallet } from 'lucide-react';
import type { Expense, PaymentView } from '@/interfaces/payment.interface';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/utils/format';

interface FinanceKpisProps {
  payments: PaymentView[];
  expenses: Expense[];
  periodLabel: string;
}

export function FinanceKpis({ payments, expenses, periodLabel }: FinanceKpisProps) {
  const revenue = payments
    .filter((payment) => payment.displayStatus === 'paid')
    .reduce((total, payment) => total + payment.amount, 0);
  const expensesTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
  const profit = revenue - expensesTotal;
  const receivable = payments
    .filter((payment) => payment.displayStatus === 'pending' || payment.displayStatus === 'late')
    .reduce((total, payment) => total + payment.amount, 0);
  const late = payments
    .filter((payment) => payment.displayStatus === 'late')
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Receita líquida"
        value={formatCurrency(revenue)}
        hint={periodLabel}
        icon={<ArrowUpCircle className="size-4" />}
        tone="success"
      />
      <StatCard
        label="Despesas"
        value={formatCurrency(expensesTotal)}
        hint={periodLabel}
        icon={<ArrowDownCircle className="size-4" />}
        tone="danger"
      />
      <StatCard
        label="Resultado"
        value={formatCurrency(profit)}
        hint={profit >= 0 ? 'Lucro no período' : 'Prejuízo no período'}
        icon={<Scale className="size-4" />}
        tone={profit >= 0 ? 'accent' : 'warning'}
      />
      <StatCard
        label="A receber"
        value={formatCurrency(receivable)}
        hint={`Inadimplência: ${formatCurrency(late)}`}
        icon={<Wallet className="size-4" />}
        tone={late > 0 ? 'warning' : 'info'}
      />
    </div>
  );
}
