import type { MuscleGroup } from '@/interfaces/workout.interface';

export interface ExerciseTemplate {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  load: string;
  restSeconds: number;
}

export const exerciseCatalog: ExerciseTemplate[] = [
  { name: 'Supino reto', muscleGroup: 'chest', sets: 4, reps: '8-10', load: '40 kg', restSeconds: 90 },
  { name: 'Supino inclinado com halteres', muscleGroup: 'chest', sets: 3, reps: '10-12', load: '18 kg', restSeconds: 75 },
  { name: 'Crucifixo na máquina', muscleGroup: 'chest', sets: 3, reps: '12', load: '25 kg', restSeconds: 60 },
  { name: 'Puxada frontal', muscleGroup: 'back', sets: 4, reps: '10', load: '45 kg', restSeconds: 90 },
  { name: 'Remada curvada', muscleGroup: 'back', sets: 3, reps: '8-10', load: '35 kg', restSeconds: 90 },
  { name: 'Remada baixa', muscleGroup: 'back', sets: 3, reps: '12', load: '40 kg', restSeconds: 75 },
  { name: 'Desenvolvimento militar', muscleGroup: 'shoulders', sets: 3, reps: '8-10', load: '20 kg', restSeconds: 90 },
  { name: 'Elevação lateral', muscleGroup: 'shoulders', sets: 3, reps: '12-15', load: '8 kg', restSeconds: 60 },
  { name: 'Rosca direta', muscleGroup: 'biceps', sets: 3, reps: '10-12', load: '12 kg', restSeconds: 60 },
  { name: 'Rosca alternada', muscleGroup: 'biceps', sets: 3, reps: '12', load: '10 kg', restSeconds: 60 },
  { name: 'Tríceps pulley', muscleGroup: 'triceps', sets: 3, reps: '12-15', load: '25 kg', restSeconds: 60 },
  { name: 'Tríceps testa', muscleGroup: 'triceps', sets: 3, reps: '10', load: '15 kg', restSeconds: 75 },
  { name: 'Agachamento livre', muscleGroup: 'legs', sets: 4, reps: '8-10', load: '50 kg', restSeconds: 120 },
  { name: 'Leg press', muscleGroup: 'legs', sets: 4, reps: '12', load: '120 kg', restSeconds: 90 },
  { name: 'Cadeira extensora', muscleGroup: 'legs', sets: 3, reps: '12-15', load: '35 kg', restSeconds: 60 },
  { name: 'Mesa flexora', muscleGroup: 'legs', sets: 3, reps: '12', load: '30 kg', restSeconds: 60 },
  { name: 'Panturrilha em pé', muscleGroup: 'legs', sets: 4, reps: '15-20', load: '60 kg', restSeconds: 45 },
  { name: 'Prancha abdominal', muscleGroup: 'abs', sets: 3, reps: '40 s', load: 'Peso corporal', restSeconds: 45 },
  { name: 'Abdominal supra', muscleGroup: 'abs', sets: 3, reps: '20', load: 'Peso corporal', restSeconds: 45 },
  { name: 'Elevação de pernas', muscleGroup: 'abs', sets: 3, reps: '15', load: 'Peso corporal', restSeconds: 45 },
  { name: 'Esteira — caminhada inclinada', muscleGroup: 'cardio', sets: 1, reps: '20 min', load: '6 km/h', restSeconds: 0 },
  { name: 'Bike ergométrica', muscleGroup: 'cardio', sets: 1, reps: '15 min', load: 'Moderado', restSeconds: 0 },
];
