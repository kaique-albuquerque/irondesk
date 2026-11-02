import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { DashboardData } from '@/interfaces/dashboard.interface';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { paymentStatusLabels } from '@/constants/labels';
import { paymentStatusTone } from '@/constants/status';
import { formatTimeBR } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { formatDateBR } from '@/utils/date';

export function RecentCheckinsCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader
        title="Check-ins recentes"
        description="Ãšltimas entradas registradas na recepÃ§Ã£o"
        actions={
          <Link to="/frequencia" className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline">
            Ver todos <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      <CardBody className="space-y-1 p-2">
        {data.recentCheckins.length === 0 ? (
          <EmptyState title="Nenhum check-in hoje" description="Os check-ins aparecem aqui em tempo real." />
        ) : (
          data.recentCheckins.map((checkin) => (
            <div key={checkin.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2">
              <Avatar name={checkin.studentName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{checkin.studentName}</p>
                <p className="truncate text-xs text-subtle">{checkin.studentPlan}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-ink tnum">{formatTimeBR(checkin.checkInAt)}</p>
                <p className="text-[11px] text-subtle">
                  {checkin.checkOutAt ? `SaÃ­da ${formatTimeBR(checkin.checkOutAt)}` : 'Na academia'}
                </p>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

export function UpcomingPaymentsCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader
        title="PrÃ³ximos vencimentos"
        description="CobranÃ§as pendentes dos prÃ³ximos dias"
        actions={
          <Link to="/financeiro" className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline">
            Financeiro <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      <CardBody className="space-y-1 p-2">
        {data.upcomingPayments.length === 0 ? (
          <EmptyState title="Nada a vencer" description="Nenhuma cobranÃ§a pendente no momento." />
        ) : (
          data.upcomingPayments.map((payment) => (
            <div key={payment.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{payment.studentName}</p>
                <p className="text-xs text-subtle">Vence em {formatDateBR(payment.dueDate)}</p>
              </div>
              <span className="text-sm font-medium text-ink tnum">{formatCurrency(payment.amount)}</span>
              <Badge tone={paymentStatusTone[payment.displayStatus]}>
                {paymentStatusLabels[payment.displayStatus]}
              </Badge>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

