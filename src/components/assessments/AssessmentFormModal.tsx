import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AssessmentView } from '@/interfaces/assessment.interface';
import type { Student } from '@/interfaces/student.interface';
import type { Employee } from '@/interfaces/employee.interface';
import {
  assessmentDefaults,
  assessmentSchema,
  toAssessmentFormValues,
  toAssessmentInput,
} from '@/schemas/assessment.schema';
import type { AssessmentFormValues } from '@/schemas/assessment.schema';
import { assessmentsService } from '@/services/api/assessments.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { AssessmentMeasureFields } from '@/components/assessments/AssessmentMeasureFields';
import { todayISO } from '@/utils/date';

interface AssessmentFormModalProps {
  open: boolean;
  assessment: AssessmentView | null;
  students: Student[];
  assessors: Employee[];
  presetStudentId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AssessmentFormModal({
  open,
  assessment,
  students,
  assessors,
  presetStudentId,
  onClose,
  onSaved,
}: AssessmentFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, formState } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { ...assessmentDefaults, date: todayISO() },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      assessment
        ? toAssessmentFormValues(assessment)
        : { ...assessmentDefaults, studentId: presetStudentId ?? '', date: todayISO() },
    );
  }, [open, assessment, presetStudentId, reset]);

  const weight = watch('weight');
  const height = watch('height');
  const bmi = weight > 0 && height > 0 ? (weight / (height / 100) ** 2).toFixed(1) : '—';

  const { run, loading, error } = useAsyncAction(async (values: AssessmentFormValues) => {
    const input = toAssessmentInput(values);
    if (assessment) await assessmentsService.update(assessment.id, input);
    else await assessmentsService.create(input);
  });

  const onSubmit = async (values: AssessmentFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast(assessment ? 'Avaliação atualizada' : 'Avaliação registrada', {
      description: `IMC calculado: ${bmi}`,
    });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={assessment ? 'Editar avaliação física' : 'Nova avaliação física'}
      description="Registre peso, altura, percentual de gordura e medidas corporais."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="assessment-form" loading={loading}>
            {assessment ? 'Salvar alterações' : 'Registrar avaliação'}
          </Button>
        </>
      }
    >
      <form id="assessment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}

        <FormGrid>
          <Field label="Aluno" error={formState.errors.studentId?.message} required>
            <Select
              placeholder="Selecione o aluno"
              options={students.map((student) => ({ value: student.id, label: student.name }))}
              {...register('studentId')}
            />
          </Field>
          <Field label="Avaliador" error={formState.errors.assessedBy?.message} required>
            <Select
              placeholder="Selecione o profissional"
              options={assessors.map((employee) => ({ value: employee.id, label: employee.name }))}
              {...register('assessedBy')}
            />
          </Field>
          <Field label="Data" error={formState.errors.date?.message} required>
            <Input type="date" {...register('date')} />
          </Field>
          <Field label="Peso (kg)" error={formState.errors.weight?.message} required>
            <Input type="number" step="0.1" {...register('weight', { valueAsNumber: true })} />
          </Field>
          <Field label="Altura (cm)" error={formState.errors.height?.message} required>
            <Input type="number" step="0.1" {...register('height', { valueAsNumber: true })} />
          </Field>
          <Field label="Gordura corporal (%)" error={formState.errors.bodyFat?.message} required>
            <Input type="number" step="0.1" {...register('bodyFat', { valueAsNumber: true })} />
          </Field>
        </FormGrid>

        <div className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-muted">
          IMC estimado: <span className="font-semibold text-ink tnum">{bmi}</span>
          {weight > 0 && height > 0 ? ' kg/m²' : ''}
        </div>

        <AssessmentMeasureFields register={register} errors={formState.errors} />

        <Field label="Observações" error={formState.errors.notes?.message}>
          <Textarea placeholder="Anotações do avaliador, dobras, recomendações..." {...register('notes')} />
        </Field>
      </form>
    </Modal>
  );
}
