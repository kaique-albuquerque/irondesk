import { ClipboardList } from 'lucide-react';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { EnrollmentsTable } from '@/components/enrollments/EnrollmentsTable';

interface EnrollmentsPanelProps {
  loading: boolean;
  enrollments: EnrollmentView[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onRenew: (enrollment: EnrollmentView) => void;
  onChangePlan: (enrollment: EnrollmentView) => void;
  onCancel: (enrollment: EnrollmentView) => void;
}

export function EnrollmentsPanel({
  loading,
  enrollments,
  page,
  pageSize,
  total,
  onPageChange,
  onCreate,
  onRenew,
  onChangePlan,
  onCancel,
}: EnrollmentsPanelProps) {
  if (loading) return <TableSkeleton rows={6} />;

  if (enrollments.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="size-5" />}
        title="Nenhuma matrícula encontrada"
        description="Ajuste os filtros ou crie uma nova matrícula para um aluno."
        action={
          <Button variant="outline" onClick={onCreate}>
            Nova matrícula
          </Button>
        }
      />
    );
  }

  return (
    <>
      <EnrollmentsTable
        enrollments={enrollments}
        onRenew={onRenew}
        onChangePlan={onChangePlan}
        onCancel={onCancel}
      />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </>
  );
}
