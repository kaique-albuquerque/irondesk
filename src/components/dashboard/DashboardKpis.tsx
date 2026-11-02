import { AlertTriangle, Clock, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react';
import type { DashboardData } from '@/interfaces/dashboard.interface';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatNumber } from '@/utils/format';

export function DashboardKpis({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Alunos ativos"
        value={formatNumber(data.activeStudents)}
        hint={`${formatNumber(data.totalStudents)} cadastrados · ${formatNumber(data.newStudentsThisMonth)} novos no mês`}
        icon={<Users className="size-4" />}
        tone="accent"
      />
      <StatCard
        label="Receita do mês"
        value={formatCurrency(data.monthlyRevenue)}
        trend={{ value: data.revenueGrowth, label: 'vs. mês anterior' }}
        icon={<Wallet className="size-4" />}
        tone="success"
      />
      <StatCard
        label="Inadimplência"
        value={formatCurrency(data.overdueAmount)}
        hint={`${formatNumber(data.overdueCount)} cobranças em atraso`}
        icon={<AlertTriangle className="size-4" />}
        tone="danger"
      />
      <StatCard
        label="Check-ins hoje"
        value={formatNumber(data.checkinsToday)}
        hint={`${formatNumber(data.activeNow)} aluno(s) treinando agora`}
        icon={<Clock className="size-4" />}
        tone="info"
      />
      <StatCard
        label="Matrículas ativas"
        value={formatNumber(data.activeEnrollments)}
        hint={`${formatNumber(data.expiringCount)} vencendo em breve`}
        icon={<UserCheck className="size-4" />}
        tone="warning"
      />
      <StatCard
        label="Ticket médio"
        value={formatCurrency(data.averageTicket)}
        hint="Valor médio por aluno ativo"
        icon={<TrendingUp className="size-4" />}
        tone="neutral"
      />
    </div>
  );
}
