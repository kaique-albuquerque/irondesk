import { Activity, CalendarCheck, CalendarClock, CreditCard, Scale } from 'lucide-react';
import type { StudentDetail } from '@/services/api/student-detail.service';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { enrollmentStatusLabels } from '@/constants/labels';
import { enrollmentStatusTone } from '@/constants/status';
import { formatCurrency, formatNumber } from '@/utils/format';
import { formatDateBR, monthKey, todayISO } from '@/utils/date';

export function StudentOverviewPanel({ detail }: { detail: StudentDetail }) {
  const activeEnrollment = detail.enrollments.find((enrollment) => enrollment.status === 'active');
  const openPayment = detail.payments.find((payment) => payment.status === 'pending');
  const lastAssessment = detail.assessments[0];
  const currentMonth = monthKey(todayISO());
  const monthCheckins = detail.checkins.filter((checkin) => monthKey(checkin.date) === currentMonth).length;
  const paidTotal = detail.payments
    .filter((payment) => payment.status === 'paid')
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Mensalidade"
          value={activeEnrollment ? formatCurrency(activeEnrollment.contractedValue) : '—'}
          hint={detail.plan ? detail.plan.name : 'Sem matrícula ativa'}
          icon={<CreditCard className="size-4" />}
        />
        <StatCard
          label="Próximo vencimento"
          value={activeEnrollment ? formatDateBR(activeEnrollment.dueDate) : '—'}
          hint={
            activeEnrollment
              ? `${activeEnrollment.daysLeft} ${activeEnrollment.daysLeft === 1 ? 'dia restante' : 'dias restantes'}`
              : 'Nenhuma cobrança aberta'
          }
          icon={<CalendarClock className="size-4" />}
          tone={activeEnrollment && activeEnrollment.daysLeft <= 7 ? 'warning' : 'info'}
        />
        <StatCard
          label="Check-ins no mês"
          value={formatNumber(monthCheckins)}
          hint={`${formatNumber(detail.checkins.length)} no total`}
          icon={<CalendarCheck className="size-4" />}
          tone="success"
        />
        <StatCard
          label="Total pago"
          value={formatCurrency(paidTotal)}
          hint={`${formatNumber(detail.payments.length)} lançamentos`}
          icon={<Activity className="size-4" />}
          tone="accent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Matrícula atual" description="Situação do contrato vigente" />
          <CardBody className="space-y-3 text-xs">
            {activeEnrollment ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Plano</span>
                  <span className="font-medium text-ink">{detail.plan?.name ?? activeEnrollment.planName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Início</span>
                  <span className="font-medium text-ink tnum">{formatDateBR(activeEnrollment.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Vencimento</span>
                  <span className="font-medium text-ink tnum">{formatDateBR(activeEnrollment.dueDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Desconto</span>
                  <span className="font-medium text-ink tnum">{activeEnrollment.discountPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Situação</span>
                  <Badge tone={enrollmentStatusTone[activeEnrollment.displayStatus]}>
                    {enrollmentStatusLabels[activeEnrollment.displayStatus]}
                  </Badge>
                </div>
              </>
            ) : (
              <p className="text-muted">Este aluno não possui matrícula ativa no momento.</p>
            )}
            {openPayment ? (
              <div className="flex items-center justify-between rounded-lg bg-warning/10 px-3 py-2">
                <span className="text-warning">Cobrança em aberto</span>
                <span className="font-medium text-warning tnum">
                  {formatCurrency(openPayment.amount)} · {formatDateBR(openPayment.dueDate)}
                </span>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Última avaliação" description="Composição corporal mais recente" />
          <CardBody className="space-y-3 text-xs">
            {lastAssessment ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
                    <Scale className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink tnum">{lastAssessment.weight} kg</p>
                    <p className="text-[11px] text-subtle">{formatDateBR(lastAssessment.date)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-surface-2 p-2">
                    <p className="text-[11px] text-subtle">IMC</p>
                    <p className="font-medium text-ink tnum">{lastAssessment.bmi.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-2 p-2">
                    <p className="text-[11px] text-subtle">Gordura</p>
                    <p className="font-medium text-ink tnum">{lastAssessment.bodyFat}%</p>
                  </div>
                  <div className="rounded-lg bg-surface-2 p-2">
                    <p className="text-[11px] text-subtle">Cintura</p>
                    <p className="font-medium text-ink tnum">{lastAssessment.measurements.waist} cm</p>
                  </div>
                </div>
                <p className="text-[11px] text-subtle">
                  Classificação: {lastAssessment.imcLabel} · {formatNumber(detail.assessments.length)} avaliações
                  registradas
                </p>
              </>
            ) : (
              <p className="text-muted">Nenhuma avaliação física registrada.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {detail.student.notes ? (
        <Card>
          <CardHeader title="Observações" description="Anotações internas sobre o aluno" />
          <CardBody>
            <p className="text-xs leading-relaxed text-muted">{detail.student.notes}</p>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
