import { LogOut, Users } from 'lucide-react';
import type { CheckinView } from '@/interfaces/checkin.interface';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatTimeBR } from '@/utils/date';

interface ActiveNowListProps {
  checkins: CheckinView[];
  loading?: boolean;
  onCheckout: (checkin: CheckinView) => void;
}

function elapsedMinutes(checkInAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(checkInAt).getTime()) / 60_000));
}

export function ActiveNowList({ checkins, loading, onCheckout }: ActiveNowListProps) {
  return (
    <div className="panel flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Presentes agora</h2>
          <p className="mt-0.5 text-xs text-muted">Alunos com check-in aberto na academia.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
          <Users className="size-3.5" />
          {checkins.length}
        </span>
      </div>

      <div className="mt-3 flex-1">
        {checkins.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title="Academia vazia"
            description="Nenhum check-in em aberto neste momento."
          />
        ) : (
          <ul className="divide-y divide-line">
            {checkins.map((checkin) => (
              <li key={checkin.id} className="flex items-center gap-3 py-2.5">
                <Avatar name={checkin.studentName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{checkin.studentName}</p>
                  <p className="text-[11px] text-subtle tnum">
                    Entrada {formatTimeBR(checkin.checkInAt)} · {elapsedMinutes(checkin.checkInAt)} min
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  loading={loading}
                  icon={<LogOut className="size-3.5" />}
                  onClick={() => onCheckout(checkin)}
                >
                  Saída
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
