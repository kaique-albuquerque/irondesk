import { useMemo, useState } from 'react';
import { CalendarClock, ChevronDown, Dumbbell, Pencil, Trash2 } from 'lucide-react';
import type { MuscleGroup, WorkoutView } from '@/interfaces/workout.interface';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { muscleGroupLabels } from '@/constants/labels';
import { formatDateBR, todayISO } from '@/utils/date';

interface WorkoutCardProps {
  workout: WorkoutView;
  onEdit?: (workout: WorkoutView) => void;
  onDelete?: (workout: WorkoutView) => void;
}

export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const expired = todayISO() > workout.expiresAt;

  const groups = useMemo(() => {
    const map = new Map<MuscleGroup, number>();
    workout.exercises.forEach((exercise) => {
      map.set(exercise.muscleGroup, (map.get(exercise.muscleGroup) ?? 0) + 1);
    });
    return [...map.entries()];
  }, [workout.exercises]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-start gap-3 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
          <Dumbbell className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-ink">{workout.name}</h3>
            <Badge tone={expired ? 'danger' : 'success'}>{expired ? 'Vencida' : 'Vigente'}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {workout.studentName} · {workout.trainerName}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-subtle">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3" />
              {formatDateBR(workout.startDate)} → {formatDateBR(workout.expiresAt)}
            </span>
            <span>{workout.exercises.length} exercícios</span>
            {groups.map(([group, count]) => (
              <span key={group}>
                {muscleGroupLabels[group]} ({count})
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit ? (
            <Button variant="ghost" size="icon" aria-label="Editar ficha" onClick={() => onEdit(workout)}>
              <Pencil className="size-4" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button variant="ghost" size="icon" aria-label="Excluir ficha" onClick={() => onDelete(workout)}>
              <Trash2 className="size-4" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            aria-label={expanded ? 'Recolher exercícios' : 'Ver exercícios'}
            onClick={() => setExpanded((value) => !value)}
          >
            <ChevronDown className={expanded ? 'size-4 rotate-180 transition' : 'size-4 transition'} />
          </Button>
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-line bg-surface-2/60 p-4">
          {workout.notes ? <p className="mb-3 text-xs text-muted">{workout.notes}</p> : null}
          <ul className="divide-y divide-line">
            {workout.exercises.map((exercise) => (
              <li key={exercise.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <div>
                  <p className="text-sm text-ink">{exercise.name}</p>
                  <p className="text-[11px] text-subtle">{muscleGroupLabels[exercise.muscleGroup]}</p>
                </div>
                <p className="text-xs text-muted tnum">
                  {exercise.sets} × {exercise.reps} · {exercise.load} · {exercise.restSeconds}s
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
