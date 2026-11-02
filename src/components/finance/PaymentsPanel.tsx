import { useMemo, useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import type { PaymentView } from '@/interfaces/payment.interface';
import type { Student } from '@/interfaces/student.interface';
import { paymentsService } from '@/services/api/payments.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PaymentsTable } from '@/components/finance/PaymentsTable';
import { PaymentFormModal } from '@/components/finance/PaymentFormModal';
import { RegisterPaymentModal } from '@/components/finance/RegisterPaymentModal';
import { paymentStatusLabels, toOptions } from '@/constants/labels';

const pageSize = 8;
const statusOptions = [{ value: 'all', label: 'Todas as situações' }, ...toOptions(paymentStatusLabels)];

interface PaymentsPanelProps {
  payments: PaymentView[];
  students: Student[];
  enrollments: EnrollmentView[];
  loading: boolean;
  onChange: () => void;
}

export function PaymentsPanel({ payments, students, enrollments, loading, onChange }: PaymentsPanelProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [registering, setRegistering] = useState<PaymentView | null>(null);
  const [confirming, setConfirming] = useState<{ action: 'cancel' | 'delete'; payment: PaymentView } | null>(null);
  const debounced = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return payments.filter((payment) => {
      const matchesTerm = !term || payment.studentName.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || payment.displayStatus === status;
      return matchesTerm && matchesStatus;
    });
  }, [payments, debounced, status]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const { run, loading: processing } = useAsyncAction(async (target: { action: 'cancel' | 'delete'; payment: PaymentView }) => {
    if (target.action === 'cancel') await paymentsService.cancel(target.payment.id);
    else await paymentsService.remove(target.payment.id);
  });

  const handleConfirm = async () => {
    if (!confirming) return;
    const success = await run(confirming);
    if (!success) return;
    toast(confirming.action === 'cancel' ? 'Cobrança cancelada' : 'Lançamento excluído', {
      description: confirming.payment.studentName,
    });
    setConfirming(null);
    onChange();
  };

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Buscar por aluno"
          className="w-full sm:w-64"
        />
        <Select
          aria-label="Filtrar por situação"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          options={statusOptions}
          className="w-auto min-w-40"
        />
        <Button className="ml-auto" icon={<Plus className="size-4" />} onClick={() => setFormOpen(true)}>
          Novo lançamento
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-5" />}
          title="Nenhum lançamento encontrado"
          description="Ajuste os filtros ou crie uma nova cobrança para um aluno."
        />
      ) : (
        <PaymentsTable
          payments={visible}
          onRegister={setRegistering}
          onCancel={(payment) => setConfirming({ action: 'cancel', payment })}
          onDelete={(payment) => setConfirming({ action: 'delete', payment })}
        />
      )}

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />

      <PaymentFormModal
        open={formOpen}
        students={students}
        enrollments={enrollments}
        onClose={() => setFormOpen(false)}
        onSaved={onChange}
      />
      <RegisterPaymentModal payment={registering} onClose={() => setRegistering(null)} onSaved={onChange} />
      <ConfirmDialog
        open={!!confirming}
        loading={processing}
        title={confirming?.action === 'cancel' ? 'Cancelar cobrança' : 'Excluir lançamento'}
        description={
          confirming?.action === 'cancel'
            ? `A cobrança de ${confirming.payment.studentName} será cancelada e não contará mais no faturamento.`
            : `O lançamento de ${confirming?.payment.studentName ?? ''} será removido permanentemente.`
        }
        confirmLabel={confirming?.action === 'cancel' ? 'Cancelar cobrança' : 'Excluir'}
        onConfirm={() => void handleConfirm()}
        onClose={() => setConfirming(null)}
      />
    </div>
  );
}
