import { useState } from 'react';
import { Plus, UserPlus, Users } from 'lucide-react';
import type { Student } from '@/interfaces/student.interface';
import { studentsService } from '@/services/api/students.service';
import { useStudentsDirectory } from '@/hooks/useStudentsDirectory';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StudentsTable } from '@/components/students/StudentsTable';
import { StudentsToolbar } from '@/components/students/StudentsToolbar';
import { StudentFormModal } from '@/components/students/StudentFormModal';

export function StudentsPage() {
  const { toast } = useToast();
  const directory = useStudentsDirectory();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);

  const { run: removeStudent, loading: removing } = useAsyncAction(async (student: Student) =>
    studentsService.remove(student.id),
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const success = await removeStudent(deleting);
    if (!success) return;
    toast('Aluno removido', {
      description: `${deleting.name} e os registros vinculados foram excluídos.`,
    });
    setDeleting(null);
    await directory.reload();
  };

  const activeCount = directory.students.filter((student) => student.status === 'active').length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Alunos"
        description={`${directory.students.length} cadastrados · ${activeCount} ativos · ${directory.filtered.length} exibidos`}
        actions={
          <Button icon={<Plus className="size-4" />} onClick={openCreate}>
            Novo aluno
          </Button>
        }
      />

      <div className="panel overflow-hidden">
        <StudentsToolbar
          search={directory.search}
          onSearchChange={directory.setSearch}
          status={directory.status}
          onStatusChange={directory.setStatus}
          planFilter={directory.planFilter}
          onPlanFilterChange={directory.setPlanFilter}
          plans={directory.plans}
        />

        {directory.loading ? (
          <TableSkeleton rows={6} />
        ) : directory.visible.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="size-5" />}
            title="Nenhum aluno encontrado"
            description="Ajuste os filtros ou cadastre um novo aluno para começar."
            action={
              <Button variant="outline" icon={<Users className="size-4" />} onClick={openCreate}>
                Cadastrar aluno
              </Button>
            }
          />
        ) : (
          <StudentsTable
            students={directory.visible}
            plansById={directory.plansById}
            onEdit={(student) => {
              setEditing(student);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
          />
        )}

        <Pagination
          page={directory.page}
          pageSize={directory.pageSize}
          total={directory.filtered.length}
          onPageChange={directory.setPage}
        />
      </div>

      <StudentFormModal
        open={formOpen}
        student={editing}
        plans={directory.plans}
        onClose={() => setFormOpen(false)}
        onSaved={directory.reload}
      />

      <ConfirmDialog
        open={!!deleting}
        loading={removing}
        title="Excluir aluno"
        description={`Remover ${deleting?.name ?? 'este aluno'} apaga matrículas, pagamentos, treinos, avaliações e check-ins vinculados. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir definitivamente"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
