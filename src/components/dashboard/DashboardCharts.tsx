import type { DashboardData } from '@/interfaces/dashboard.interface';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { StudentsChart } from '@/components/charts/StudentsChart';
import { FrequencyChart } from '@/components/charts/FrequencyChart';
import { DistributionChart, DistributionLegend } from '@/components/charts/DistributionChart';
import { formatCurrency } from '@/utils/format';

export function DashboardCharts({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader
          title="Receita x despesas"
          description="Últimos seis meses de movimentação financeira"
          actions={
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent" /> Receita
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-info" /> Despesas
              </span>
            </div>
          }
        />
        <CardBody>
          <RevenueChart data={data.revenueSeries} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Distribuição de planos" description="Alunos ativos por plano" />
        <CardBody className="space-y-4">
          <DistributionChart data={data.planDistribution} />
          <DistributionLegend data={data.planDistribution} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Evolução de alunos" description="Base ativa nos últimos meses" />
        <CardBody>
          <StudentsChart data={data.studentsSeries} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Frequência semanal" description="Check-ins por dia da semana" />
        <CardBody>
          <FrequencyChart data={data.weeklyFrequency} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Receita acumulada" description="Resumo do período" />
        <CardBody className="space-y-3">
          {data.revenueSeries.map((point) => (
            <div key={point.month} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted">{point.month}</span>
              <span className="font-medium text-ink tnum">{formatCurrency(point.receita)}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
