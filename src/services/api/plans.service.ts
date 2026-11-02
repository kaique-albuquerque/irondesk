import type { Plan, PlanInput } from '@/interfaces/plan.interface';
import { simulateLatency } from '@/services/api/helpers';
import { mutateDatabase, selectCollection } from '@/services/storage/database.service';
import { AppError } from '@/utils/errors';
import { createId } from '@/utils/id';

export const plansService = {
  async list(): Promise<Plan[]> {
    await simulateLatency();
    return [...selectCollection('plans')].sort((a, b) => a.price - b.price);
  },

  async create(input: PlanInput): Promise<Plan> {
    await simulateLatency();
    const plan: Plan = { ...input, id: createId('plan') };
    mutateDatabase((database) => {
      database.plans.push(plan);
    });
    return plan;
  },

  async update(id: string, input: PlanInput): Promise<Plan> {
    await simulateLatency();
    return mutateDatabase((database) => {
      const index = database.plans.findIndex((plan) => plan.id === id);
      if (index < 0) throw new AppError('Plano não encontrado.');
      if (database.plans.some((plan) => plan.id !== id && plan.name.toLowerCase() === input.name.toLowerCase())) {
        throw new AppError('Já existe um plano com este nome.');
      }
      database.plans[index] = { ...database.plans[index], ...input };
      return database.plans[index];
    });
  },

  async remove(id: string): Promise<void> {
    await simulateLatency();
    mutateDatabase((database) => {
      const linked = database.enrollments.some((enrollment) => enrollment.planId === id);
      if (linked) throw new AppError('Este plano possui matrículas vinculadas e não pode ser excluído.');
      database.plans = database.plans.filter((plan) => plan.id !== id);
    });
  },

  async toggleStatus(id: string): Promise<Plan> {
    await simulateLatency();
    return mutateDatabase((database) => {
      const plan = database.plans.find((item) => item.id === id);
      if (!plan) throw new AppError('Plano não encontrado.');
      plan.status = plan.status === 'active' ? 'inactive' : 'active';
      return plan;
    });
  },

  countStudents(): Record<string, number> {
    return selectCollection('enrollments').reduce<Record<string, number>>((accumulator, enrollment) => {
      if (enrollment.status !== 'active') return accumulator;
      accumulator[enrollment.planId] = (accumulator[enrollment.planId] ?? 0) + 1;
      return accumulator;
    }, {});
  },
};
