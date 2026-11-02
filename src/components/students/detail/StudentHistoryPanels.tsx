import type { StudentDetail } from '@/services/api/student-detail.service';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { enrollmentStatusLabels, paymentMethodLabels, paymentStatusLabels } from '@/constants/labels';
import { enrollmentStatusTone, paymentStatusTone } from '@/constants/status';
import { formatCurrency } from '@/utils/format';
import { formatDateBR } from '@/utils/date';

export function StudentEnrollmentsPanel({ enrollments }: { enrollments: StudentDetail['enrollments'] }) {
  return (
    <Card>
      <CardHeader title="Histórico de matrículas" description="Contratos, renovações e trocas de plano" />
      <CardBody className="p-0">
        {enrollments.length === 0 ? (
          <EmptyState title="Nenhuma matrícula" description="Este aluno ainda não possui contratos registrados." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Plano</TH>
                <TH>Início</TH>
                <TH>Vencimento</TH>
                <TH className="text-right">Valor</TH>
                <TH>Situação</TH>
              </TR>
            </THead>
            <TBody>
              {enrollments.map((enrollment) => (
                <TR key={enrollment.id}>
                  <TD className="font-medium text-ink">{enrollment.planName}</TD>
                  <TD className="text-xs text-muted tnum">{formatDateBR(enrollment.startDate)}</TD>
                  <TD className="text-xs text-muted tnum">{formatDateBR(enrollment.dueDate)}</TD>
                  <TD className="text-right tnum">{formatCurrency(enrollment.contractedValue)}</TD>
                  <TD>
                    <Badge tone={enrollmentStatusTone[enrollment.displayStatus]}>
                      {enrollmentStatusLabels[enrollment.displayStatus]}
                    </Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

export function StudentPaymentsPanel({ payments }: { payments: StudentDetail['payments'] }) {
  const paid = payments.filter((payment) => payment.status === 'paid');
  const total = paid.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card>
      <CardHeader
        title="Lançamentos financeiros"
        description={`${paid.length} pagamentos confirmados · ${formatCurrency(total)} recebidos`}
      />
      <CardBody className="p-0">
        {payments.length === 0 ? (
          <EmptyState title="Nenhum lançamento" description="Não há cobranças registradas para este aluno." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Descrição</TH>
                <TH>Vencimento</TH>
                <TH>Pagamento</TH>
                <TH>Forma</TH>
                <TH className="text-right">Valor</TH>
                <TH>Situação</TH>
              </TR>
            </THead>
            <TBody>
              {payments.map((payment) => (
                <TR key={payment.id}>
                  <TD className="text-sm text-ink">{payment.description}</TD>
                  <TD className="text-xs text-muted tnum">{formatDateBR(payment.dueDate)}</TD>
                  <TD className="text-xs text-muted tnum">
                    {payment.paidAt ? formatDateBR(payment.paidAt) : '—'}
                  </TD>
                  <TD className="text-xs text-muted">
                    {payment.method ? paymentMethodLabels[payment.method] : '—'}
                  </TD>
                  <TD className="text-right font-medium text-ink tnum">{formatCurrency(payment.amount)}</TD>
                  <TD>
                    <Badge tone={paymentStatusTone[payment.displayStatus]}>
                      {paymentStatusLabels[payment.displayStatus]}
                    </Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
