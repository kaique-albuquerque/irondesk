import { RefreshCw } from 'lucide-react';
import { dashboardService } from '@/services/api/dashboard.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CardsSkeleton } from '@/components/ui/Skeleton';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { RecentCheckinsCard, UpcomingPaymentsCard } from '@/components/dashboard/DashboardLists';
import { ExpiringEnrollmentsCard } from '@/components/dashboard/ExpiringEnrollmentsCard';
import { DEMO_USER } from '@/constants/app';
import { greeting } from '@/utils/date';

const longDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
}).format(new Date());

export function DashboardPage() {
  const { data, loading, error, reload } = useAsyncData(() => dashboardService.get());
  const firstName = DEMO_USER.name.split(' ')[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description={`${longDate.charAt(0).toUpperCase()}${longDate.slice(1)} · visão geral da academia`}
        actions={
          <Button
            variant="outline"
            icon={<RefreshCw className="size-4" />}
            onClick={() => void reload()}
            loading={loading}
          >
            Atualizar
          </Button>
        }
      />

      {error ? (
        <div className="panel p-6">
          <p className="text-sm font-medium text-danger">{error}</p>
          <p className="mt-1 text-xs text-muted">
            Não foi possível carregar os indicadores. Tente novamente.
          </p>
        </div>
      ) : loading || !data ? (
        <div className="space-y-4">
          <CardsSkeleton count={6} />
          <CardsSkeleton count={3} />
        </div>
      ) : (
        <>
          <DashboardKpis data={data} />
          <DashboardCharts data={data} />
          <div className="grid gap-4 lg:grid-cols-3">
            <RecentCheckinsCard data={data} />
            <UpcomingPaymentsCard data={data} />
            <ExpiringEnrollmentsCard data={data} />
          </div>
        </>
      )}
    </div>
  );
}
