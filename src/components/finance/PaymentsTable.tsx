import { Link } from 'react-router-dom';
import { Ban, CheckCircle2, Trash2 } from 'lucide-react';
import type { PaymentView } from '@/interfaces/payment.interface';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { paymentMethodLabels, paymentStatusLabels } from '@/constants/labels';
import { paymentStatusTone } from '@/constants/status';
import { formatDateBR } from '@/utils/date';
import { formatCurrency } from '@/utils/format';

interface PaymentsTableProps {
  payments: PaymentView[];
  onRegister: (payment: PaymentView) => void;
  onCancel: (payment: PaymentView) => void;
  onDelete: (payment: PaymentView) => void;
}

export function PaymentsTable({ payments, onRegister, onCancel, onDelete }: PaymentsTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Aluno</TH>
          <TH>Descrição</TH>
          <TH>Vencimento</TH>
          <TH>Valor</TH>
          <TH>Situação</TH>
          <TH>Pagamento</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {payments.map((payment) => {
          const settled = payment.displayStatus === 'paid' || payment.displayStatus === 'cancelled';
          return (
            <TR key={payment.id}>
              <TD>
                <Link to={`/alunos/${payment.studentId}`} className="text-sm font-medium text-ink hover:text-accent-ink">
                  {payment.studentName}
                </Link>
              </TD>
              <TD>
                <span className="text-xs text-muted">{payment.description}</span>
              </TD>
              <TD>
                <span className="text-xs text-muted tnum">{formatDateBR(payment.dueDate)}</span>
              </TD>
              <TD>
                <span className="text-sm font-medium text-ink tnum">{formatCurrency(payment.amount)}</span>
              </TD>
              <TD>
                <Badge tone={paymentStatusTone[payment.displayStatus]}>
                  {paymentStatusLabels[payment.displayStatus]}
                </Badge>
              </TD>
              <TD>
                <span className="block text-[11px] text-subtle tnum">
                  {payment.paidAt ? formatDateBR(payment.paidAt) : '—'}
                </span>
                <span className="block text-[11px] text-muted">
                  {payment.method ? paymentMethodLabels[payment.method] : 'Não informado'}
                </span>
              </TD>
              <TD>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Registrar pagamento"
                    disabled={settled}
                    onClick={() => onRegister(payment)}
                  >
                    <CheckCircle2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Cancelar cobrança"
                    disabled={settled}
                    onClick={() => onCancel(payment)}
                  >
                    <Ban className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Excluir lançamento"
                    onClick={() => onDelete(payment)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}
