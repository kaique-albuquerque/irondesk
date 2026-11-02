import { z } from 'zod';
import type { PlanInput } from '@/interfaces/plan.interface';

export const planSchema = z.object({
  name: z.string().trim().min(3, 'Informe o nome do plano'),
  description: z.string().trim().min(10, 'Descreva o plano em poucas palavras'),
  price: z.number({ invalid_type_error: 'Informe o valor' }).positive('O valor deve ser maior que zero'),
  durationMonths: z
    .number({ invalid_type_error: 'Informe a duração' })
    .int()
    .min(0, 'A duração não pode ser negativa'),
  weeklyFrequency: z.string().trim().min(1, 'Informe a frequência semanal'),
  cycle: z.enum(['monthly', 'quarterly', 'semiannual', 'annual', 'trial', 'custom']),
  benefits: z.string(),
  status: z.enum(['active', 'inactive']),
  highlighted: z.boolean(),
});

export type PlanFormValues = z.infer<typeof planSchema>;

export const planDefaults: PlanFormValues = {
  name: '',
  description: '',
  price: 0,
  durationMonths: 1,
  weeklyFrequency: '3x por semana',
  cycle: 'monthly',
  benefits: '',
  status: 'active',
  highlighted: false,
};

export function toPlanInput(values: PlanFormValues): PlanInput {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price.toFixed(2)),
    durationMonths: values.durationMonths,
    weeklyFrequency: values.weeklyFrequency.trim(),
    cycle: values.cycle,
    benefits: values.benefits
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    status: values.status,
    highlighted: values.highlighted,
  };
}

export function toPlanFormValues(plan: PlanInput): PlanFormValues {
  return {
    name: plan.name,
    description: plan.description,
    price: plan.price,
    durationMonths: plan.durationMonths,
    weeklyFrequency: plan.weeklyFrequency,
    cycle: plan.cycle,
    benefits: plan.benefits.join('\n'),
    status: plan.status,
    highlighted: plan.highlighted,
  };
}
