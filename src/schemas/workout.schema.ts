import { z } from 'zod';
import type { Exercise, MuscleGroup, WorkoutInput } from '@/interfaces/workout.interface';

export const exerciseSchema = z.object({
  name: z.string().trim().min(3, 'Informe o exercício'),
  muscleGroup: z.enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs', 'cardio']),
  sets: z.number({ invalid_type_error: 'Informe as séries' }).int().min(1, 'Mínimo de 1 série'),
  reps: z.string().trim().min(1, 'Informe as repetições'),
  load: z.string().trim(),
  restSeconds: z.number({ invalid_type_error: 'Informe o descanso' }).int().min(0),
  notes: z.string(),
});

export const workoutSchema = z.object({
  studentId: z.string().min(1, 'Selecione o aluno'),
  trainerId: z.string(),
  name: z.string().trim().min(3, 'Dê um nome para a ficha'),
  startDate: z.string().min(1, 'Informe a data de início'),
  expiresAt: z.string().min(1, 'Informe a validade'),
  notes: z.string(),
  exercises: z.array(exerciseSchema).min(1, 'Adicione pelo menos um exercício'),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;
export type ExerciseFormValues = z.infer<typeof exerciseSchema>;

export const emptyExercise: ExerciseFormValues = {
  name: '',
  muscleGroup: 'chest',
  sets: 3,
  reps: '12',
  load: '—',
  restSeconds: 60,
  notes: '',
};

export const workoutDefaults: WorkoutFormValues = {
  studentId: '',
  trainerId: '',
  name: '',
  startDate: '',
  expiresAt: '',
  notes: '',
  exercises: [emptyExercise],
};

export function toExercise(values: ExerciseFormValues, index: number): Exercise {
  return { id: `ex-${index}-${values.name.slice(0, 6)}`, ...values };
}

export function toWorkoutInput(values: WorkoutFormValues): WorkoutInput {
  return {
    studentId: values.studentId,
    trainerId: values.trainerId,
    name: values.name.trim(),
    startDate: values.startDate,
    expiresAt: values.expiresAt,
    notes: values.notes.trim(),
    exercises: values.exercises.map(toExercise),
  };
}

export function toWorkoutFormValues(workout: WorkoutInput): WorkoutFormValues {
  return {
    studentId: workout.studentId,
    trainerId: workout.trainerId,
    name: workout.name,
    startDate: workout.startDate,
    expiresAt: workout.expiresAt,
    notes: workout.notes,
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup as MuscleGroup,
      sets: exercise.sets,
      reps: exercise.reps,
      load: exercise.load,
      restSeconds: exercise.restSeconds,
      notes: exercise.notes,
    })),
  };
}
