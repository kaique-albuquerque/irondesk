export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'abs'
  | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  load: string;
  restSeconds: number;
  notes: string;
}

export interface Workout {
  id: string;
  studentId: string;
  trainerId: string;
  name: string;
  startDate: string;
  expiresAt: string;
  notes: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface WorkoutView extends Workout {
  studentName: string;
  trainerName: string;
}

export interface WorkoutInput {
  studentId: string;
  trainerId: string;
  name: string;
  startDate: string;
  expiresAt: string;
  notes: string;
  exercises: Exercise[];
}
