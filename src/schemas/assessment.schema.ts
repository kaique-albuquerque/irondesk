import { z } from 'zod';
import type { AssessmentInput } from '@/interfaces/assessment.interface';

const measure = z.number({ invalid_type_error: 'Informe a medida' }).min(0, 'A medida não pode ser negativa');

export const assessmentSchema = z.object({
  studentId: z.string().min(1, 'Selecione o aluno'),
  assessedBy: z.string().min(1, 'Selecione o avaliador'),
  date: z.string().min(1, 'Informe a data'),
  weight: z.number({ invalid_type_error: 'Informe o peso' }).min(20, 'Peso mínimo de 20 kg'),
  height: z.number({ invalid_type_error: 'Informe a altura' }).min(100, 'Altura mínima de 100 cm'),
  bodyFat: z.number({ invalid_type_error: 'Informe o percentual' }).min(0).max(70, 'Percentual inválido'),
  shoulder: measure,
  chest: measure,
  waist: measure,
  hip: measure,
  thigh: measure,
  arm: measure,
  notes: z.string(),
});

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;

export const assessmentDefaults: AssessmentFormValues = {
  studentId: '',
  assessedBy: '',
  date: '',
  weight: 70,
  height: 170,
  bodyFat: 20,
  shoulder: 0,
  chest: 0,
  waist: 0,
  hip: 0,
  thigh: 0,
  arm: 0,
  notes: '',
};

export function toAssessmentInput(values: AssessmentFormValues): AssessmentInput {
  return {
    studentId: values.studentId,
    assessedBy: values.assessedBy,
    date: values.date,
    weight: values.weight,
    height: values.height,
    bodyFat: values.bodyFat,
    notes: values.notes.trim(),
    measurements: {
      shoulder: values.shoulder,
      chest: values.chest,
      waist: values.waist,
      hip: values.hip,
      thigh: values.thigh,
      arm: values.arm,
    },
  };
}

export function toAssessmentFormValues(assessment: AssessmentInput): AssessmentFormValues {
  return {
    studentId: assessment.studentId,
    assessedBy: assessment.assessedBy,
    date: assessment.date,
    weight: assessment.weight,
    height: assessment.height,
    bodyFat: assessment.bodyFat,
    notes: assessment.notes,
    ...assessment.measurements,
  };
}
