import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock } from 'lucide-react';
import type { DashboardData } from '@/interfaces/dashboard.interface';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateBR } from '@/utils/date';

export function ExpiringEnrollmentsCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader
        title="Matrículas a renovar"
        description="Alunos com plano perto do vencimento"
        actions={
          <Link
            to="/matriculas"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
          >
            Matrículas <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      <CardBody className="space-y-1 p-2">
        {data.expiringEnrollments.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="size-5" />}
            title="Tudo em dia"
            description="Nenhuma matrícula vence nos próximos dias."
          />
        ) : (
          data.expiringEnrollments.map((enrollment) => (
            <Link
              key={enrollment.id}
              to={`/alunos/${enrollment.studentId}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2"
            >
              <Avatar name={enrollment.studentName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{enrollment.studentName}</p>
                <p className="truncate text-xs text-subtle">{enrollment.planName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-warning tnum">{enrollment.daysLeft}d</p>
                <p className="text-[11px] text-subtle">{formatDateBR(enrollment.dueDate)}</p>
              </div>
            </Link>
          ))
        )}
      </CardBody>
    </Card>
  );
}
