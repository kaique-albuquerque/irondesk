import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Plan } from '@/interfaces/plan.interface';
import type { Student } from '@/interfaces/student.interface';
import { enrollmentSchema, toEnrollmentInput } from '@/schemas/enrollment.schema';
import type { EnrollmentFormValues } from '@/schemas/enrollment.schema';
import { enrollmentsService } from '@/services/api/enrollments.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { computeContractedValue, computeDueDate } from '@/utils/enrollment';
import { formatCurrency } from '@/utils/format';
import { formatDateBR, todayISO } from '@/utils/date';

interface EnrollmentFormModalProps {
  open: boolean;
  students: Student[];
  plans: Plan[];
  presetStudentId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function EnrollmentFormModal({
  open,
  students,
  plans,
  presetStudentId,
  onClose,
  onSaved,
}: EnrollmentFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, formState } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { studentId: '', planId: '', startDate: todayISO(), discountPercent: 0 },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      studentId: presetStudentId ?? '',
      planId: '',
      startDate: todayISO(),
      discountPercent: 0,
    });
  }, [open, presetStudentId, reset]);

  const planId = watch('planId');
  const startDate = watch('startDate');
  const discount = Number(watch('discountPercent') || 0);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === planId) ?? null, [plans, planId]);
  const contracted = selectedPlan ? computeContractedValue(selectedPlan, discount) : 0;
  const dueDate = selectedPlan && startDate ? computeDueDate(selectedPlan, startDate) : null;

  const { run, loading, error } = useAsyncAction(async (values: EnrollmentFormValues) => {
    await enrollmentsService.create(toEnrollmentInput(values));
  });

  const onSubmit = async (values: EnrollmentFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast('Matrícula criada', { description: 'As cobranças do período foram geradas.' });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova matrícula"
      description="Vincule o aluno a um plano e gere as cobranças automaticamente."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="enrollment-form" loading={loading}>
            Confirmar matrícula
          </Button>
        </>
      }
    >
      <form id="enrollment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}
        <Field label="Aluno" htmlFor="studentId" error={formState.errors.studentId?.message} required>
          <Select
            id="studentId"
            placeholder="Selecione o aluno"
            options={students.map((student) => ({ value: student.id, label: student.name }))}
            {...register('studentId')}
          />
        </Field>
        <Field label="Plano" htmlFor="planId" error={formState.errors.planId?.message} required>
          <Select
            id="planId"
            placeholder="Selecione o plano"
            options={plans
              .filter((plan) => plan.status === 'active')
              .map((plan) => ({ value: plan.id, label: `${plan.name} · ${formatCurrency(plan.price)}` }))}
            {...register('planId')}
          />
        </Field>
        <FormGrid>
          <Field label="Início" htmlFor="startDate" error={formState.errors.startDate?.message} required>
            <Input id="startDate" type="date" {...register('startDate')} />
          </Field>
          <Field label="Desconto (%)" htmlFor="discountPercent" error={formState.errors.discountPercent?.message}>
            <Input
              id="discountPercent"
              type="number"
              min="0"
              max="100"
              step="1"
              {...register('discountPercent', { valueAsNumber: true })}
            />
          </Field>
        </FormGrid>

        {selectedPlan ? (
          <dl className="grid gap-3 rounded-xl border border-line bg-surface-2 p-4 text-xs sm:grid-cols-3">
            <div>
              <dt className="text-subtle">Valor contratado</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink tnum">{formatCurrency(contracted)}</dd>
            </div>
            <div>
              <dt className="text-subtle">Vencimento</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink tnum">{dueDate ? formatDateBR(dueDate) : '—'}</dd>
            </div>
            <div>
              <dt className="text-subtle">Frequência</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">{selectedPlan.weeklyFrequency}</dd>
            </div>
          </dl>
        ) : null}
      </form>
    </Modal>
  );
}
