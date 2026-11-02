import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import { enrollmentsService } from '@/services/api/enrollments.service';
import { studentsService } from '@/services/api/students.service';
import { plansService } from '@/services/api/plans.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EnrollmentStats } from '@/components/enrollments/EnrollmentStats';
import { EnrollmentsToolbar } from '@/components/enrollments/EnrollmentsToolbar';
import { EnrollmentsPanel } from '@/components/enrollments/EnrollmentsPanel';
import { EnrollmentFormModal } from '@/components/enrollments/EnrollmentFormModal';
import { ChangePlanModal } from '@/components/enrollments/ChangePlanModal';

const pageSize = 10;

export function EnrollmentsPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(async () => {
    const [enrollments, students, plans] = await Promise.all([
      enrollmentsService.list(),
      studentsService.list(),
      plansService.list(),
    ]);
    return { enrollments, students, plans };
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [changing, setChanging] = useState<EnrollmentView | null>(null);
  const [cancelling, setCancelling] = useState<EnrollmentView | null>(null);
  const debounced = useDebounce(search);

  const enrollments = data?.enrollments ?? [];
  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return enrollments.filter((enrollment) => {
      const matchesTerm = !term || enrollment.studentName.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || enrollment.displayStatus === status;
      return matchesTerm && matchesStatus;
    });
  }, [enrollments, debounced, status]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const { run: renew, loading: renewing } = useAsyncAction(async (enrollment: EnrollmentView) => {
    await enrollmentsService.renew(enrollment.id);
  });
  const { run: cancel, loading: cancellingLoading } = useAsyncAction(async (enrollment: EnrollmentView) => {
    await enrollmentsService.cancel(enrollment.id);
  });

  const handleRenew = async (enrollment: EnrollmentView) => {
    const success = await renew(enrollment);
    if (!success) return;
    toast('Matrícula renovada', { description: `${enrollment.studentName} · novo período gerado.` });
    await reload();
  };

  const handleCancel = async () => {
    if (!cancelling) return;
    const success = await cancel(cancelling);
    if (!success) return;
    toast('Matrícula cancelada', { description: cancelling.studentName });
    setCancelling(null);
    await reload();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Matrículas"
        description="Contratos ativos, renovações e histórico de planos por aluno"
        actions={
          <Button icon={<Plus className="size-4" />} onClick={() => setFormOpen(true)}>
            Nova matrícula
          </Button>
        }
      />

      <EnrollmentStats enrollments={enrollments} />

      <div className="panel overflow-hidden">
        <EnrollmentsToolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          total={filtered.length}
          busy={renewing || cancellingLoading}
        />

        <EnrollmentsPanel
          loading={loading}
          enrollments={visible}
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onCreate={() => setFormOpen(true)}
          onRenew={(enrollment) => void handleRenew(enrollment)}
          onChangePlan={setChanging}
          onCancel={setCancelling}
        />
      </div>

      <EnrollmentFormModal
        open={formOpen}
        students={data?.students ?? []}
        plans={data?.plans ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ChangePlanModal
        enrollment={changing}
        plans={data?.plans ?? []}
        onClose={() => setChanging(null)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={!!cancelling}
        loading={cancellingLoading}
        title="Cancelar matrícula"
        description={`A matrícula de ${cancelling?.studentName ?? ''} será encerrada e as cobranças futuras pendentes serão canceladas.`}
        confirmLabel="Cancelar matrícula"
        onConfirm={() => void handleCancel()}
        onClose={() => setCancelling(null)}
      />
    </div>
  );
}
