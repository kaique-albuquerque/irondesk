import type { Employee } from '@/interfaces/employee.interface';
import type { Student } from '@/interfaces/student.interface';
import type { Exercise, Workout } from '@/interfaces/workout.interface';
import { exerciseCatalog } from '@/data/exercises';
import { addDays } from '@/utils/date';
import { randomChance, randomInt, randomPick } from '@/utils/random';

function buildExercises(count: number): Exercise[] {
  const chosen = new Set<string>();
  const exercises: Exercise[] = [];
  while (exercises.length < count) {
    const template = randomPick(exerciseCatalog);
    if (chosen.has(template.name)) continue;
    chosen.add(template.name);
    exercises.push({
      id: `ex_${exercises.length}_${template.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: template.name,
      muscleGroup: template.muscleGroup,
      sets: template.sets,
      reps: template.reps,
      load: template.load,
      restSeconds: template.restSeconds,
      notes: '',
    });
  }
  return exercises;
}

export function buildWorkouts(
  students: Student[],
  employees: Employee[],
  today: string,
): Workout[] {
  const trainers = employees.filter(
    (employee) => employee.status === 'active' && (employee.role === 'professor' || employee.role === 'personal'),
  );
  const candidates = students.filter((student) => student.status === 'active');

  return candidates.slice(0, 26).map((student, index) => {
    const startDate = addDays(today, -randomInt(2, 55));
    return {
      id: `wkt_${`${index + 1}`.padStart(3, '0')}`,
      studentId: student.id,
      trainerId: trainers[index % trainers.length].id,
      name: randomChance(0.5) ? 'Treino A/B — Hipertrofia' : 'Treino full body — Condicionamento',
      startDate,
      expiresAt: addDays(startDate, 90),
      notes: randomChance(0.35) ? 'Ajustar carga conforme evolução nas próximas semanas.' : '',
      exercises: buildExercises(randomInt(5, 7)),
      createdAt: `${startDate}T10:00:00.000Z`,
    };
  });
}
