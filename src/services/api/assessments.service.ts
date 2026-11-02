import type { Assessment, AssessmentInput, AssessmentView } from '@/interfaces/assessment.interface';
import { simulateLatency } from '@/services/api/helpers';
import { getDatabase, mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';

export function calcBmi(weight: number, heightCm: number): number {
  if (!weight || !heightCm) return 0;
  return Number((weight / (heightCm / 100) ** 2).toFixed(1));
}

export function bmiLabel(bmi: number): string {
  if (bmi <= 0) return 'Sem dados';
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

function toView(assessment: Assessment): AssessmentView {
  const database = getDatabase();
  const student = database.students.find((item) => item.id === assessment.studentId);
  const bmi = calcBmi(assessment.weight, assessment.height);
  return {
    ...assessment,
    studentName: student?.name ?? 'Aluno removido',
    bmi,
    imcLabel: bmiLabel(bmi),
  };
}

export const assessmentsService = {
  async list(): Promise<AssessmentView[]> {
    await simulateLatency();
    return selectCollection('assessments')
      .map(toView)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async listByStudent(studentId: string): Promise<AssessmentView[]> {
    await simulateLatency();
    return selectCollection('assessments')
      .filter((assessment) => assessment.studentId === studentId)
      .map(toView)
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  async create(input: AssessmentInput): Promise<void> {
    await simulateLatency();
    if (input.weight <= 0 || input.height <= 0) throw new AppError('Peso e altura devem ser maiores que zero.');
    mutateDatabase((database) => {
      database.assessments.push({ ...input, id: createId('asm') });
    });
  },

  async update(id: string, input: AssessmentInput): Promise<void> {
    await simulateLatency();
    if (input.weight <= 0 || input.height <= 0) throw new AppError('Peso e altura devem ser maiores que zero.');
    mutateDatabase((database) => {
      const index = database.assessments.findIndex((assessment) => assessment.id === id);
      if (index < 0) throw new AppError('Avaliação não encontrada.');
      database.assessments[index] = { ...database.assessments[index], ...input };
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.assessments = database.assessments.filter((assessment) => assessment.id !== id);
    });
  },

  latestByStudent(studentId: string): AssessmentView | null {
    const items = selectCollection('assessments')
      .filter((assessment) => assessment.studentId === studentId)
      .map(toView)
      .sort((a, b) => b.date.localeCompare(a.date));
    return items[0] ?? null;
  },
};
