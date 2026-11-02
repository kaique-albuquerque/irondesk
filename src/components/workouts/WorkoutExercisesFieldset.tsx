import type { FieldArrayWithId } from 'react-hook-form';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Plus } from 'lucide-react';
import type { WorkoutFormValues } from '@/schemas/workout.schema';
import { Button } from '@/components/ui/Button';
import { WorkoutExerciseRow } from '@/components/workouts/WorkoutExerciseRow';

interface WorkoutExercisesFieldsetProps {
  fields: FieldArrayWithId<WorkoutFormValues, 'exercises', 'id'>[];
  register: UseFormRegister<WorkoutFormValues>;
  errors: FieldErrors<WorkoutFormValues>;
  onAppend: () => void;
  onRemove: (index: number) => void;
}

export function WorkoutExercisesFieldset({
  fields,
  register,
  errors,
  onAppend,
  onRemove,
}: WorkoutExercisesFieldsetProps) {
  const groupError = errors.exercises?.message;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">
          Exercícios <span className="text-muted">({fields.length})</span>
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<Plus className="size-3.5" />}
          onClick={onAppend}
        >
          Adicionar
        </Button>
      </div>
      {typeof groupError === 'string' ? (
        <p className="text-xs font-medium text-danger">{groupError}</p>
      ) : null}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <WorkoutExerciseRow
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}
