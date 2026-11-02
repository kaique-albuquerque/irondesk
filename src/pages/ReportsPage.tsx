import { useState } from 'react';
import { reportsService } from '@/services/api/reports.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/ui/PageHeader';
import { CardsSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { ReportsKpis } from '@/components/reports/ReportsKpis';
import { ReportsDistributionCards, ReportsRevenueCard } from '@/components/reports/ReportsCharts';
import { ReportsPlanTable, ReportsTopStudents } from '@/components/reports/ReportsTables';
import { ReportsToolbar } from '@/components/reports/ReportsToolbar';
import { formatDateBR, todayISO } from '@/utils/date';

export function ReportsPage() {
  const [months, setMonths] = useState(6);
  const { data, loading, error } = useAsyncData(() => reportsService.get(months), [months]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Analise resultado financeiro, mix de pagamentos, desempenho dos planos e frequência dos alunos."
      />

      <ReportsToolbar
        months={months}
        onMonthsChange={setMonths}
        series={data?.series ?? []}
        disabled={loading}
      />

      {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}

      {loading && !data ? (
        <div className="space-y-6">
          <CardsSkeleton count={4} />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          <ReportsKpis totals={data.totals} />

          <ReportsRevenueCard
            series={data.series}
            title={`Receita e despesas nos últimos ${months} meses`}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsDistributionCards methods={data.methods} categories={data.categories} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsPlanTable plans={data.plans} />
            <ReportsTopStudents students={data.topStudents} />
          </div>

          <p className="text-center text-[11px] text-subtle">
            Relatório gerado em {formatDateBR(todayISO())} · dados fictícios para demonstração.
          </p>
        </div>
      ) : null}
    </div>
  );
}
