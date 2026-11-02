import { Banknote, Percent, Receipt, TrendingDown } from 'lucide-react';
import type { ReportTotals } from '@/interfaces/reports.interface';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';

export function ReportsKpis({ totals }: { totals: ReportTotals }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Receita recebida"
        value={formatCurrency(totals.revenue)}
        hint={`${formatNumber(totals.tickets)} pagamentos`}
        icon={<Banknote className="size-4" />}
        tone="success"
      />
      <StatCard
        label="Despesas"
        value={formatCurrency(totals.expenses)}
        hint="Custos operacionais do período"
        icon={<TrendingDown className="size-4" />}
        tone="danger"
      />
      <StatCard
        label="Lucro líquido"
        value={formatCurrency(totals.profit)}
        hint={`Margem de ${formatPercent(totals.margin)}`}
        icon={<Percent className="size-4" />}
        tone={totals.profit >= 0 ? 'accent' : 'danger'}
      />
      <StatCard
        label="Ticket médio"
        value={formatCurrency(totals.averageTicket)}
        hint="Receita média por pagamento"
        icon={<Receipt className="size-4" />}
        tone="info"
      />
    </div>
  );
}
