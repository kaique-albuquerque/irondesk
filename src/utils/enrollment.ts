import type { Plan } from '@/interfaces/plan.interface';
import { addDays, addMonths } from './date';

export function computeDueDate(plan: Pick<Plan, 'durationMonths'>, startDate: string): string {
  return plan.durationMonths === 0 ? addDays(startDate, 7) : addMonths(startDate, plan.durationMonths);
}

export function computeContractedValue(
  plan: Pick<Plan, 'price'>,
  discountPercent: number,
): number {
  return Number((plan.price * (1 - discountPercent / 100)).toFixed(2));
}

export function monthlyEquivalent(value: number, durationMonths: number): number {
  return Number((value / Math.max(1, durationMonths)).toFixed(2));
}
