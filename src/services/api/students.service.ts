import type { Student, StudentInput } from '@/interfaces/student.interface';
import { simulateLatency, sortBy } from '@/services/api/helpers';
import { mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';
import { todayISO } from '@/utils/date';

function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '');
}

function assertUnique(input: StudentInput, ignoreId?: string): void {
  const students = selectCollection('students');
  const duplicated = students.some(
    (student) =>
      student.id !== ignoreId &&
      (normalizeCpf(student.cpf) === normalizeCpf(input.cpf) ||
        student.email.toLowerCase() === input.email.toLowerCase()),
  );
  if (duplicated) {
    throw new AppError('Já existe um aluno com este CPF ou e-mail.');
  }
}

export const studentsService = {
  async list(): Promise<Student[]> {
    await simulateLatency();
    return sortBy(selectCollection('students'), (student) => student.name);
  },

  async get(id: string): Promise<Student | null> {
    await simulateLatency();
    return selectCollection('students').find((student) => student.id === id) ?? null;
  },

  async create(input: StudentInput): Promise<Student> {
    await simulateLatency();
    assertUnique(input);
    const student: Student = { ...input, id: createId('std'), createdAt: todayISO() };
    mutateDatabase((database) => {
      database.students.push(student);
    });
    return student;
  },

  async update(id: string, input: StudentInput): Promise<Student> {
    await simulateLatency();
    assertUnique(input, id);
    return mutateDatabase((database) => {
      const index = database.students.findIndex((student) => student.id === id);
      if (index < 0) throw new AppError('Aluno não encontrado.');
      const updated: Student = { ...database.students[index], ...input };
      database.students[index] = updated;
      return updated;
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.students = database.students.filter((student) => student.id !== id);
      database.enrollments = database.enrollments.filter((item) => item.studentId !== id);
      database.payments = database.payments.filter((item) => item.studentId !== id);
      database.checkins = database.checkins.filter((item) => item.studentId !== id);
      database.workouts = database.workouts.filter((item) => item.studentId !== id);
      database.assessments = database.assessments.filter((item) => item.studentId !== id);
    });
  },
};
