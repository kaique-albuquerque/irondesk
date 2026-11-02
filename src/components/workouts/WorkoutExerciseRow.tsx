import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import type { WorkoutFormValues } from '@/schemas/workout.schema';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Field } from '@/components/ui/Field';
import { muscleGroupOptions } from '@/constants/labels';

interface WorkoutExerciseRowProps {
  index: number;
  register: UseFormRegister<WorkoutFormValues>;
  errors: FieldErrors<WorkoutFormValues>;
  onRemove: () => void;
}

export function WorkoutExerciseRow({ index, register, errors, onRemove }: WorkoutExerciseRowProps) {
  const error = errors.exercises?.[index];
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted">Exercício {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-subtle hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="size-3.5" />
          Remover
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-6">
        <Field label="Exercício" error={error?.name?.message} className="sm:col-span-3" required>
          <Input placeholder="Supino reto" invalid={!!error?.name} {...register(`exercises.${index}.name`)} />
        </Field>
        <Field label="Grupo" error={error?.muscleGroup?.message} className="sm:col-span-3">
          <Select options={muscleGroupOptions} {...register(`exercises.${index}.muscleGroup`)} />
        </Field>
        <Field label="Séries" error={error?.sets?.message}>
          <Input type="number" min={1} invalid={!!error?.sets} {...register(`exercises.${index}.sets`)} />
        </Field>
        <Field label="Reps" error={error?.reps?.message}>
          <Input placeholder="8-10" invalid={!!error?.reps} {...register(`exercises.${index}.reps`)} />
        </Field>
        <Field label="Carga" error={error?.load?.message}>
          <Input placeholder="40 kg" {...register(`exercises.${index}.load`)} />
        </Field>
        <Field label="Descanso (s)" error={error?.restSeconds?.message}>
          <Input type="number" min={0} invalid={!!error?.restSeconds} {...register(`exercises.${index}.restSeconds`)} />
        </Field>
        <Field label="Observações" className="sm:col-span-2">
          <Input placeholder="Opcional" {...register(`exercises.${index}.notes`)} />
        </Field>
      </div>
    </div>
  );
}
