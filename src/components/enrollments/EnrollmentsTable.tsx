import { Link } from 'react-router-dom';
import { MoreHorizontal, RefreshCw, Repeat, XCircle } from 'lucide-react';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { enrollmentStatusLabels } from '@/constants/labels';
import { enrollmentStatusTone } from '@/constants/status';
import { enrollmentDurationLabel } from '@/utils/status';
import { formatDateBR } from '@/utils/date';
import { formatCurrency } from '@/utils/format';

interface EnrollmentsTableProps {
  enrollments: EnrollmentView[];
  onRenew: (enrollment: EnrollmentView) => void;
  onChangePlan: (enrollment: EnrollmentView) => void;
  onCancel: (enrollment: EnrollmentView) => void;
}

export function EnrollmentsTable({ enrollments, onRenew, onChangePlan, onCancel }: EnrollmentsTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Aluno</TH>
          <TH>Plano</TH>
          <TH>Período</TH>
          <TH>Valor</TH>
          <TH>Situação</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {enrollments.map((enrollment) => {
          const cancelled = enrollment.displayStatus === 'cancelled';
          return (
            <TR key={enrollment.id}>
              <TD>
                <Link
                  to={`/alunos/${enrollment.studentId}`}
                  className="text-sm font-medium text-ink hover:text-accent-ink"
                >
                  {enrollment.studentName}
                </Link>
                <p className="text-xs text-subtle">
                  {enrollment.discountPercent > 0 ? `${enrollment.discountPercent}% de desconto` : 'Sem desconto'}
                </p>
              </TD>
              <TD>
                <span className="text-sm text-ink">{enrollment.planName}</span>
              </TD>
              <TD>
                <span className="block text-xs text-muted tnum">
                  {formatDateBR(enrollment.startDate)} → {formatDateBR(enrollment.dueDate)}
                </span>
                <span className="block text-[11px] text-subtle">
                  {enrollmentDurationLabel(enrollment.daysLeft)}
                </span>
              </TD>
              <TD>
                <span className="text-sm font-medium text-ink tnum">
                  {formatCurrency(enrollment.contractedValue)}
                </span>
              </TD>
              <TD>
                <Badge tone={enrollmentStatusTone[enrollment.displayStatus]}>
                  {enrollmentStatusLabels[enrollment.displayStatus]}
                </Badge>
              </TD>
              <TD>
                <div className="flex justify-end">
                  <Dropdown
                    trigger={
                      <span className="inline-flex size-8 items-center justify-center rounded-lg text-subtle hover:bg-surface-2 hover:text-ink">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Ações da matrícula de {enrollment.studentName}</span>
                      </span>
                    }
                    items={[
                      {
                        label: 'Renovar',
                        icon: <RefreshCw className="size-3.5" />,
                        onClick: () => onRenew(enrollment),
                        disabled: cancelled,
                      },
                      {
                        label: 'Trocar plano',
                        icon: <Repeat className="size-3.5" />,
                        onClick: () => onChangePlan(enrollment),
                        disabled: cancelled,
                      },
                      {
                        label: 'Cancelar matrícula',
                        icon: <XCircle className="size-3.5" />,
                        onClick: () => onCancel(enrollment),
                        danger: true,
                        disabled: cancelled,
                      },
                    ]}
                  />
                </div>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}
