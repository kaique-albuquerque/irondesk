import type { Checkin, CheckinInput, CheckinView } from '@/interfaces/checkin.interface';
import { simulateLatency } from '@/services/api/helpers';
import { getDatabase, mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { todayISO } from '@/utils/date';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';

function durationMinutes(checkInAt: string, checkOutAt: string | null): number | null {
  if (!checkOutAt) return null;
  const diff = new Date(checkOutAt).getTime() - new Date(checkInAt).getTime();
  return Math.max(0, Math.round(diff / 60_000));
}

function toView(checkin: Checkin): CheckinView {
  const database = getDatabase();
  const student = database.students.find((item) => item.id === checkin.studentId);
  const plan = database.plans.find((item) => item.id === student?.planId);
  return {
    ...checkin,
    studentName: student?.name ?? 'Aluno removido',
    studentPlan: plan?.name ?? 'Sem plano',
    durationMinutes: durationMinutes(checkin.checkInAt, checkin.checkOutAt),
  };
}

export const checkinsService = {
  async list(): Promise<CheckinView[]> {
    await simulateLatency();
    return selectCollection('checkins')
      .map(toView)
      .sort((a, b) => b.checkInAt.localeCompare(a.checkInAt));
  },

  async listByStudent(studentId: string): Promise<CheckinView[]> {
    await simulateLatency();
    return selectCollection('checkins')
      .filter((checkin) => checkin.studentId === studentId)
      .map(toView)
      .sort((a, b) => b.checkInAt.localeCompare(a.checkInAt));
  },

  async create(input: CheckinInput): Promise<CheckinView> {
    await simulateLatency();
    const today = todayISO();
    const existing = selectCollection('checkins').find(
      (checkin) => checkin.studentId === input.studentId && checkin.date === today && !checkin.checkOutAt,
    );
    if (existing) throw new AppError('Este aluno já possui um check-in em aberto hoje.');
    const checkin: Checkin = { ...input, id: createId('chk'), checkOutAt: null };
    mutateDatabase((database) => {
      database.checkins.push(checkin);
    });
    return toView(checkin);
  },

  async checkout(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      const checkin = database.checkins.find((item) => item.id === id);
      if (!checkin) throw new AppError('Check-in não encontrado.');
      if (checkin.checkOutAt) throw new AppError('Este check-in já foi finalizado.');
      checkin.checkOutAt = new Date().toISOString();
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      database.checkins = database.checkins.filter((checkin) => checkin.id !== id);
    });
  },
};
