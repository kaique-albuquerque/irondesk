import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Student } from '@/interfaces/student.interface';
import type { Employee } from '@/interfaces/employee.interface';
import type { WorkoutView } from '@/interfaces/workout.interface';
import {
  emptyExercise,
  toWorkoutFormValues,
  toWorkoutInput,
  workoutDefaults,
  workoutSchema,
} from '@/schemas/workout.schema';
import type { WorkoutFormValues } from '@/schemas/workout.schema';
import { workoutsService } from '@/services/api/workouts.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { WorkoutExercisesFieldset } from '@/components/workouts/WorkoutExercisesFieldset';
import { addDays, todayISO } from '@/utils/date';

interface WorkoutFormModalProps {
  open: boolean;
  workout: WorkoutView | null;
  students: Student[];
  trainers: Employee[];
  onClose: () => void;
  onSaved: () => void;
}

export function WorkoutFormModal({ open, workout, students, trainers, onClose, onSaved }: WorkoutFormModalProps) {
  const { toast } = useToast();
  const { register, control, handleSubmit, reset, formState } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { ...workoutDefaults, startDate: todayISO(), expiresAt: addDays(todayISO(), 90) },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'exercises' });

  useEffect(() => {
    if (!open) return;
    reset(
      workout
        ? toWorkoutFormValues(workout)
        : { ...workoutDefaults, startDate: todayISO(), expiresAt: addDays(todayISO(), 90) },
    );
  }, [open, workout, reset]);

  const { run, loading, error } = useAsyncAction(async (values: WorkoutFormValues) => {
    const input = toWorkoutInput(values);
    if (workout) await workoutsService.update(workout.id, input);
    else await workoutsService.create(input);
  });

  const onSubmit = async (values: WorkoutFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast(workout ? 'Ficha atualizada' : 'Ficha criada', { description: values.name });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={workout ? 'Editar ficha de treino' : 'Nova ficha de treino'}
      description="Monte o treino com os exercícios, séries, repetições e cargas."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="workout-form" loading={loading}>
            {workout ? 'Salvar alterações' : 'Criar ficha'}
          </Button>
        </>
      }
    >
      <form id="workout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}

        <FormGrid>
          <Field label="Aluno" htmlFor="workoutStudent" error={formState.errors.studentId?.message} required>
            <Select
              id="workoutStudent"
              placeholder="Selecione o aluno"
              options={students.map((student) => ({ value: student.id, label: student.name }))}
              {...register('studentId')}
            />
          </Field>
          <Field label="Professor responsável" htmlFor="workoutTrainer">
            <Select
              id="workoutTrainer"
              placeholder="Não atribuído"
              options={trainers.map((trainer) => ({ value: trainer.id, label: trainer.name }))}
              {...register('trainerId')}
            />
          </Field>
          <Field label="Nome da ficha" htmlFor="workoutName" error={formState.errors.name?.message} required>
            <Input id="workoutName" placeholder="Treino A · Hipertrofia" {...register('name')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Início" htmlFor="workoutStart" error={formState.errors.startDate?.message} required>
              <Input id="workoutStart" type="date" {...register('startDate')} />
            </Field>
            <Field label="Validade" htmlFor="workoutExpires" error={formState.errors.expiresAt?.message} required>
              <Input id="workoutExpires" type="date" {...register('expiresAt')} />
            </Field>
          </div>
        </FormGrid>

        <Field label="Observações" htmlFor="workoutNotes">
          <Textarea id="workoutNotes" placeholder="Aquecimento, progressões, restrições..." {...register('notes')} />
        </Field>

        <WorkoutExercisesFieldset
          fields={fields}
          register={register}
          errors={formState.errors}
          onAppend={() => append({ ...emptyExercise })}
          onRemove={remove}
        />
      </form>
    </Modal>
  );
}
