import type { ReportData } from '@/interfaces/reports.interface';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { DistributionChart, DistributionLegend } from '@/components/charts/DistributionChart';
import { formatCurrency, formatNumber } from '@/utils/format';

export function ReportsRevenueCard({ series, title }: { series: ReportData['series']; title: string }) {
  return (
    <Card>
      <CardHeader title="Receita x despesas" description={title} />
      <CardBody>
        <RevenueChart data={series} />
      </CardBody>
    </Card>
  );
}

export function ReportsDistributionCards({
  methods,
  categories,
}: {
  methods: ReportData['methods'];
  categories: ReportData['categories'];
}) {
  return (
    <>
      <Card>
        <CardHeader title="Formas de pagamento" description="Participação na receita do período" />
        <CardBody className="space-y-4">
          <DistributionChart data={methods} formatter={formatCurrency} />
          <DistributionLegend data={methods} formatter={formatCurrency} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Despesas por categoria" description="Onde o dinheiro foi gasto" />
        <CardBody className="space-y-4">
          <DistributionChart data={categories} formatter={formatCurrency} />
          <DistributionLegend data={categories} formatter={formatCurrency} />
        </CardBody>
      </Card>
    </>
  );
}

export function ReportsMethodSummary({ methods }: { methods: ReportData['methods'] }) {
  const total = methods.reduce((sum, slice) => sum + slice.value, 0);
  return (
    <p className="text-xs text-muted">
      Total distribuído: <span className="font-medium text-ink tnum">{formatCurrency(total)}</span> em{' '}
      {formatNumber(methods.length)} formas de pagamento.
    </p>
  );
}
