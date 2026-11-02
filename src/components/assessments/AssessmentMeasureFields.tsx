import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { AssessmentFormValues } from '@/schemas/assessment.schema';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';

const measures = [
  { name: 'shoulder', label: 'Ombro' },
  { name: 'chest', label: 'Peito' },
  { name: 'waist', label: 'Cintura' },
  { name: 'hip', label: 'Quadril' },
  { name: 'thigh', label: 'Coxa' },
  { name: 'arm', label: 'Braço' },
] as const;

interface AssessmentMeasureFieldsProps {
  register: UseFormRegister<AssessmentFormValues>;
  errors: FieldErrors<AssessmentFormValues>;
}

export function AssessmentMeasureFields({ register, errors }: AssessmentMeasureFieldsProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted">Medidas corporais (cm)</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {measures.map((measure) => (
          <Field key={measure.name} label={measure.label} error={errors[measure.name]?.message}>
            <Input type="number" min={0} step="0.1" {...register(measure.name, { valueAsNumber: true })} />
          </Field>
        ))}
      </div>
    </div>
  );
}
