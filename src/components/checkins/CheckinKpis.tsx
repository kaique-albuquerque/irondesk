import { Activity, Clock, UserCheck, Users } from 'lucide-react';
import type { CheckinView } from '@/interfaces/checkin.interface';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber } from '@/utils/format';

interface CheckinKpisProps {
  checkins: CheckinView[];
  todayCount: number;
}

export function CheckinKpis({ checkins, todayCount }: CheckinKpisProps) {
  const open = checkins.filter((checkin) => !checkin.checkOutAt);
  const finished = checkins.filter((checkin) => checkin.durationMinutes !== null);
  const average =
    finished.length > 0
      ? Math.round(finished.reduce((total, item) => total + (item.durationMinutes ?? 0), 0) / finished.length)
      : 0;
  const uniqueStudents = new Set(checkins.map((checkin) => checkin.studentId)).size;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Check-ins hoje"
        value={formatNumber(todayCount)}
        hint="Entradas registradas na recepção"
        icon={<Activity className="size-4" />}
      />
      <StatCard
        label="Presentes agora"
        value={formatNumber(open.length)}
        hint="Check-ins em aberto"
        icon={<Users className="size-4" />}
        tone="success"
      />
      <StatCard
        label="Permanência média"
        value={`${average} min`}
        hint="Média dos check-ins finalizados"
        icon={<Clock className="size-4" />}
        tone="info"
      />
      <StatCard
        label="Alunos únicos"
        value={formatNumber(uniqueStudents)}
        hint="Alunos que treinaram no período"
        icon={<UserCheck className="size-4" />}
        tone="warning"
      />
    </div>
  );
}
