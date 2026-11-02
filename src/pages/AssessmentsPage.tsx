import { useEffect, useMemo, useState } from 'react';
import { ClipboardPlus, Plus } from 'lucide-react';
import type { AssessmentView } from '@/interfaces/assessment.interface';
import { assessmentsService } from '@/services/api/assessments.service';
import { studentsService } from '@/services/api/students.service';
import { employeesService } from '@/services/api/employees.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AssessmentsStudentSection } from '@/components/assessments/AssessmentsStudentSection';
import { AssessmentFormModal } from '@/components/assessments/AssessmentFormModal';

export function AssessmentsPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(async () => {
    const [assessments, students, employees] = await Promise.all([
      assessmentsService.list(),
      studentsService.list(),
      employeesService.list(),
    ]);
    return { assessments, students, assessors: employees.filter((item) => item.status === 'active') };
  });

  const [studentId, setStudentId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AssessmentView | null>(null);
  const [deleting, setDeleting] = useState<AssessmentView | null>(null);

  const assessments = data?.assessments ?? [];
  const studentsWithAssessments = useMemo(
    () => (data?.students ?? []).filter((student) => assessments.some((item) => item.studentId === student.id)),
    [data?.students, assessments],
  );

  useEffect(() => {
    if (studentId || studentsWithAssessments.length === 0) return;
    setStudentId(studentsWithAssessments[0].id);
  }, [studentId, studentsWithAssessments]);

  const studentAssessments = useMemo(
    () => assessments.filter((assessment) => assessment.studentId === studentId),
    [assessments, studentId],
  );

  const assessorName =
    data?.assessors.find((employee) => employee.id === studentAssessments[0]?.assessedBy)?.name ?? 'Não atribuído';

  const { run: remove, loading: removing } = useAsyncAction(async (assessment: AssessmentView) => {
    await assessmentsService.remove(assessment.id);
  });

  const handleDelete = async () => {
    if (!deleting) return;
    const success = await remove(deleting);
    if (!success) return;
    toast('Avaliação removida', { description: deleting.studentName });
    setDeleting(null);
    await reload();
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Avaliações físicas"
        description="Acompanhe peso, IMC, percentual de gordura e medidas ao longo do tempo"
        actions={
          <Button icon={<Plus className="size-4" />} onClick={openNew} disabled={!data?.students.length}>
            Nova avaliação
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-72">
          <label htmlFor="assessmentStudent" className="mb-1.5 block text-xs font-medium text-muted">
            Aluno
          </label>
          <Select
            id="assessmentStudent"
            placeholder="Selecione o aluno"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            options={studentsWithAssessments.map((student) => ({ value: student.id, label: student.name }))}
          />
        </div>
        <span className="pb-2 text-xs text-subtle">
          {studentAssessments.length} {studentAssessments.length === 1 ? 'avaliação' : 'avaliações'} registradas
        </span>
      </div>

      {loading ? (
        <Skeleton className="h-28 rounded-xl" />
      ) : studentAssessments.length === 0 ? (
        <EmptyState
          icon={<ClipboardPlus className="size-5" />}
          title="Nenhuma avaliação registrada"
          description="Selecione um aluno com histórico ou registre a primeira avaliação física."
          action={
            <Button variant="outline" onClick={openNew}>
              Nova avaliação
            </Button>
          }
        />
      ) : (
        <AssessmentsStudentSection
          assessments={studentAssessments}
          assessorName={assessorName}
          onEdit={(assessment) => {
            setEditing(assessment);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      )}

      <AssessmentFormModal
        open={formOpen}
        assessment={editing}
        students={data?.students ?? []}
        assessors={data?.assessors ?? []}
        presetStudentId={studentId}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={!!deleting}
        loading={removing}
        title="Excluir avaliação"
        description={`A avaliação de ${deleting?.studentName ?? ''} será removida permanentemente.`}
        confirmLabel="Excluir"
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
