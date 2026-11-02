import type { Workout, WorkoutInput, WorkoutView } from '@/interfaces/workout.interface';
import { simulateLatency } from '@/services/api/helpers';
import { getDatabase, mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { todayISO } from '@/utils/date';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';

function toView(workout: Workout): WorkoutView {
  const database = getDatabase();
  const student = database.students.find((item) => item.id === workout.studentId);
  const trainer = database.employees.find((item) => item.id === workout.trainerId);
  return {
    ...workout,
    studentName: student?.name ?? 'Aluno removido',
    trainerName: trainer?.name ?? 'Não atribuído',
  };
}

export const workoutsService = {
  async list(): Promise<WorkoutView[]> {
    await simulateLatency();
    return selectCollection('workouts')
      .map(toView)
      .sort((a, b) => b.startDate.localeCompare(a.startDate));
  },

  async listByStudent(studentId: string): Promise<WorkoutView[]> {
    await simulateLatency();
    return selectCollection('workouts')
      .filter((workout) => workout.studentId === studentId)
      .map(toView)
      .sort((a, b) => b.startDate.localeCompare(a.startDate));
  },

  async create(input: WorkoutInput): Promise<void> {
    await simulateLatency();
    if (input.exercises.length === 0) throw new AppError('Inclua ao menos um exercício na ficha.');
    mutateDatabase((database) => {
      database.workouts.push({ ...input, id: createId('wkt'), createdAt: todayISO() });
    });
  },

  async update(id: string, input: WorkoutInput): Promise<void> {
    await simulateLatency();
    if (input.exercises.length === 0) throw new AppError('Inclua ao menos um exercício na ficha.');
    mutateDatabase((database) => {
      const index = database.workouts.findIndex((workout) => workout.id === id);
      if (index < 0) throw new AppError('Ficha de treino não encontrada.');
      database.workouts[index] = { ...database.workouts[index], ...input };
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.workouts = database.workouts.filter((workout) => workout.id !== id);
    });
  },
};
