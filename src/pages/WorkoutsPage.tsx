import { useMemo, useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import type { WorkoutView } from '@/interfaces/workout.interface';
import { workoutsService } from '@/services/api/workouts.service';
import { studentsService } from '@/services/api/students.service';
import { employeesService } from '@/services/api/employees.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CardsSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { WorkoutsToolbar } from '@/components/workouts/WorkoutsToolbar';
import { WorkoutFormModal } from '@/components/workouts/WorkoutFormModal';

export function WorkoutsPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(async () => {
    const [workouts, students, employees] = await Promise.all([
      workoutsService.list(),
      studentsService.list(),
      employeesService.list(),
    ]);
    return { workouts, students, trainers: employees.filter((item) => item.status === 'active') };
  });

  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<WorkoutView | null>(null);
  const [deleting, setDeleting] = useState<WorkoutView | null>(null);
  const debounced = useDebounce(search);

  const workouts = data?.workouts ?? [];
  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return workouts.filter((workout) => {
      const matchesTerm =
        !term ||
        workout.studentName.toLowerCase().includes(term) ||
        workout.name.toLowerCase().includes(term);
      const matchesGroup =
        muscleGroup === 'all' || workout.exercises.some((exercise) => exercise.muscleGroup === muscleGroup);
      return matchesTerm && matchesGroup;
    });
  }, [workouts, debounced, muscleGroup]);

  const { run: remove, loading: removing } = useAsyncAction(async (workout: WorkoutView) => {
    await workoutsService.remove(workout.id);
  });

  const handleDelete = async () => {
    if (!deleting) return;
    const success = await remove(deleting);
    if (!success) return;
    toast('Ficha removida', { description: deleting.name });
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
        title="Treinos"
        description="Fichas de treino por aluno, com séries, cargas e grupos musculares"
        actions={
          <Button icon={<Plus className="size-4" />} onClick={openNew}>
            Nova ficha
          </Button>
        }
      />

      <WorkoutsToolbar
        search={search}
        onSearchChange={setSearch}
        muscleGroup={muscleGroup}
        onMuscleGroupChange={setMuscleGroup}
        total={filtered.length}
      />

      {loading ? (
        <CardsSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="size-5" />}
          title="Nenhuma ficha de treino"
          description="Crie a primeira ficha vinculando um aluno aos exercícios do programa."
          action={
            <Button variant="outline" onClick={openNew}>
              Nova ficha
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {filtered.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onEdit={(item) => {
                setEditing(item);
                setFormOpen(true);
              }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <WorkoutFormModal
        open={formOpen}
        workout={editing}
        students={data?.students ?? []}
        trainers={data?.trainers ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={!!deleting}
        loading={removing}
        title="Excluir ficha de treino"
        description={`A ficha "${deleting?.name ?? ''}" será removida permanentemente.`}
        confirmLabel="Excluir ficha"
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
