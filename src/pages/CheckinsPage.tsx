import { useMemo, useState } from 'react';
import type { CheckinView } from '@/interfaces/checkin.interface';
import type { DayFrequencyPoint } from '@/interfaces/dashboard.interface';
import { checkinsService } from '@/services/api/checkins.service';
import { studentsService } from '@/services/api/students.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { FrequencyChart } from '@/components/charts/FrequencyChart';
import { CheckinKpis } from '@/components/checkins/CheckinKpis';
import { ReceptionCheckinCard } from '@/components/checkins/ReceptionCheckinCard';
import { ActiveNowList } from '@/components/checkins/ActiveNowList';
import { CheckinHistoryTable } from '@/components/checkins/CheckinHistoryTable';
import { addDays, formatDateBR, todayISO } from '@/utils/date';
import { Activity } from 'lucide-react';

type HistoryTab = 'today' | 'all';

function buildWeeklySeries(checkins: CheckinView[]): DayFrequencyPoint[] {
  const today = todayISO();
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const label = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const count = checkins.filter((checkin) => checkin.date === date).length;
    return { day: label, checkins: count };
  });
}

export function CheckinsPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(async () => {
    const [checkins, students] = await Promise.all([checkinsService.list(), studentsService.list()]);
    return { checkins, students };
  });

  const [tab, setTab] = useState<HistoryTab>('today');
  const checkins = data?.checkins ?? [];
  const today = todayISO();

  const todayCheckins = useMemo(() => checkins.filter((checkin) => checkin.date === today), [checkins, today]);
  const openCheckins = useMemo(() => checkins.filter((checkin) => !checkin.checkOutAt), [checkins]);
  const openStudentIds = useMemo(
    () => new Set(openCheckins.map((checkin) => checkin.studentId)),
    [openCheckins],
  );
  const weekly = useMemo(() => buildWeeklySeries(checkins), [checkins]);
  const history = tab === 'today' ? todayCheckins : checkins.slice(0, 40);

  const { run: checkout, loading: checkingOut } = useAsyncAction(async (checkin: CheckinView) => {
    await checkinsService.checkout(checkin.id);
  });

  const handleCheckout = async (checkin: CheckinView) => {
    const success = await checkout(checkin);
    if (!success) return;
    toast('Saída registrada', { description: checkin.studentName });
    await reload();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Frequência"
        description="Controle de entrada e saída dos alunos, com histórico de permanência"
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <CheckinKpis checkins={checkins} todayCount={todayCheckins.length} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ReceptionCheckinCard
          students={data?.students ?? []}
          openStudentIds={openStudentIds}
          onCheckedIn={reload}
        />
        <ActiveNowList checkins={openCheckins} loading={checkingOut} onCheckout={(item) => void handleCheckout(item)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold text-ink">Últimos 7 dias</h2>
          <p className="mb-3 mt-0.5 text-xs text-muted">Volume diário de check-ins na academia.</p>
          <FrequencyChart data={weekly} />
        </div>

        <div className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-ink">Histórico</h2>
              <p className="text-xs text-muted">
                {tab === 'today' ? `${formatDateBR(today)} · ${todayCheckins.length} check-ins` : 'Últimos 40 registros'}
              </p>
            </div>
            <Tabs
              items={[
                { value: 'today', label: 'Hoje', count: todayCheckins.length },
                { value: 'all', label: 'Recentes' },
              ]}
              value={tab}
              onChange={setTab}
            />
          </div>
          {history.length === 0 ? (
            <EmptyState
              icon={<Activity className="size-5" />}
              title="Sem check-ins"
              description="Registre a entrada de um aluno para iniciar o histórico."
            />
          ) : (
            <div className="max-h-[420px] overflow-auto">
              <CheckinHistoryTable checkins={history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
