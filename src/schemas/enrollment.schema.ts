import { z } from 'zod';
import type { EnrollmentInput } from '@/interfaces/enrollment.interface';

export const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Selecione o aluno'),
  planId: z.string().min(1, 'Selecione o plano'),
  startDate: z.string().min(1, 'Informe a data de início'),
  discountPercent: z
    .number({ invalid_type_error: 'Informe o desconto' })
    .min(0, 'O desconto não pode ser negativo')
    .max(100, 'O desconto máximo é 100%'),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export function toEnrollmentInput(values: EnrollmentFormValues): EnrollmentInput {
  return {
    studentId: values.studentId,
    planId: values.planId,
    startDate: values.startDate,
    discountPercent: values.discountPercent,
  };
}
