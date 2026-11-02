import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import type { Plan } from '@/interfaces/plan.interface';
import { enrollmentsService } from '@/services/api/enrollments.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { formatCurrency } from '@/utils/format';

const changePlanSchema = z.object({ planId: z.string().min(1, 'Selecione o novo plano') });
type ChangePlanValues = z.infer<typeof changePlanSchema>;

interface ChangePlanModalProps {
  enrollment: EnrollmentView | null;
  plans: Plan[];
  onClose: () => void;
  onSaved: () => void;
}

export function ChangePlanModal({ enrollment, plans, onClose, onSaved }: ChangePlanModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState } = useForm<ChangePlanValues>({
    resolver: zodResolver(changePlanSchema),
    defaultValues: { planId: '' },
  });

  useEffect(() => {
    if (enrollment) reset({ planId: '' });
  }, [enrollment, reset]);

  const { run, loading, error } = useAsyncAction(async (values: ChangePlanValues) => {
    if (!enrollment) return;
    await enrollmentsService.changePlan(enrollment.id, values.planId);
  });

  const onSubmit = async (values: ChangePlanValues) => {
    if (!enrollment) return;
    const success = await run(values);
    if (!success) return;
    toast('Plano alterado', {
      description: `${enrollment.studentName} · matrícula anterior cancelada e nova criada.`,
    });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={!!enrollment}
      onClose={onClose}
      title="Trocar plano"
      description={
        enrollment
          ? `A matrícula atual de ${enrollment.studentName} será cancelada e uma nova será criada com o plano escolhido.`
          : undefined
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="change-plan-form" loading={loading}>
            Confirmar troca
          </Button>
        </>
      }
    >
      <form id="change-plan-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}
        <Field label="Novo plano" htmlFor="newPlanId" error={formState.errors.planId?.message} required>
          <Select
            id="newPlanId"
            placeholder="Selecione o plano"
            options={plans
              .filter((plan) => plan.status === 'active' && plan.id !== enrollment?.planId)
              .map((plan) => ({ value: plan.id, label: `${plan.name} · ${formatCurrency(plan.price)}` }))}
            {...register('planId')}
          />
        </Field>
        <p className="rounded-lg border border-line bg-surface-2 p-3 text-xs text-muted">
          Plano atual: <span className="font-medium text-ink">{enrollment?.planName}</span> · valor{' '}
          <span className="font-medium text-ink tnum">
            {enrollment ? formatCurrency(enrollment.contractedValue) : '—'}
          </span>
        </p>
      </form>
    </Modal>
  );
}
