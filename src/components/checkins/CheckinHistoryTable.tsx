import { Link } from 'react-router-dom';
import type { CheckinView } from '@/interfaces/checkin.interface';
import { Badge } from '@/components/ui/Badge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { formatDateBR, formatTimeBR } from '@/utils/date';

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return 'Em treino';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h${rest > 0 ? ` ${rest}min` : ''}`;
}

export function CheckinHistoryTable({ checkins }: { checkins: CheckinView[] }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Aluno</TH>
          <TH>Plano</TH>
          <TH>Data</TH>
          <TH>Entrada</TH>
          <TH>Saída</TH>
          <TH>Permanência</TH>
        </TR>
      </THead>
      <TBody>
        {checkins.map((checkin) => (
          <TR key={checkin.id}>
            <TD>
              <Link to={`/alunos/${checkin.studentId}`} className="text-sm font-medium text-ink hover:text-accent-ink">
                {checkin.studentName}
              </Link>
            </TD>
            <TD>
              <span className="text-xs text-muted">{checkin.studentPlan}</span>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">{formatDateBR(checkin.date)}</span>
            </TD>
            <TD>
              <span className="text-xs text-ink tnum">{formatTimeBR(checkin.checkInAt)}</span>
            </TD>
            <TD>
              <span className="text-xs text-muted tnum">
                {checkin.checkOutAt ? formatTimeBR(checkin.checkOutAt) : '—'}
              </span>
            </TD>
            <TD>
              <Badge tone={checkin.checkOutAt ? 'neutral' : 'success'}>{formatDuration(checkin.durationMinutes)}</Badge>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
