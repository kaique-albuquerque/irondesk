import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Plan } from '@/interfaces/plan.interface';
import { planDefaults, planSchema, toPlanFormValues, toPlanInput } from '@/schemas/plan.schema';
import type { PlanFormValues } from '@/schemas/plan.schema';
import { plansService } from '@/services/api/plans.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { billingCycleOptions, planStatusLabels, toOptions } from '@/constants/labels';

interface PlanFormModalProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSaved: () => void;
}

export function PlanFormModal({ open, plan, onClose, onSaved }: PlanFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, control, formState } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: planDefaults,
  });

  useEffect(() => {
    if (open) reset(plan ? toPlanFormValues(plan) : planDefaults);
  }, [open, plan, reset]);

  const { run, loading, error } = useAsyncAction(async (values: PlanFormValues) => {
    if (plan) await plansService.update(plan.id, toPlanInput(values));
    else await plansService.create(toPlanInput(values));
  });

  const onSubmit = async (values: PlanFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast(plan ? 'Plano atualizado' : 'Plano criado', { description: values.name });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={plan ? 'Editar plano' : 'Novo plano'}
      description="Defina valores, duração e benefícios comercializados na recepção."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="plan-form" loading={loading}>
            {plan ? 'Salvar alterações' : 'Criar plano'}
          </Button>
        </>
      }
    >
      <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}
        <Field label="Nome do plano" htmlFor="name" error={formState.errors.name?.message} required>
          <Input id="name" placeholder="Ex.: Iron Black" invalid={!!formState.errors.name} {...register('name')} />
        </Field>
        <Field label="Descrição" htmlFor="description" error={formState.errors.description?.message} required>
          <Input
            id="description"
            placeholder="Resumo do posicionamento do plano"
            invalid={!!formState.errors.description}
            {...register('description')}
          />
        </Field>
        <FormGrid>
          <Field label="Valor (R$)" htmlFor="price" error={formState.errors.price?.message} required>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              invalid={!!formState.errors.price}
              {...register('price', { valueAsNumber: true })}
            />
          </Field>
          <Field label="Duração (meses)" htmlFor="durationMonths" error={formState.errors.durationMonths?.message} required>
            <Input
              id="durationMonths"
              type="number"
              min="0"
              invalid={!!formState.errors.durationMonths}
              {...register('durationMonths', { valueAsNumber: true })}
            />
          </Field>
          <Field label="Frequência semanal" htmlFor="weeklyFrequency" error={formState.errors.weeklyFrequency?.message} required>
            <Input id="weeklyFrequency" placeholder="Ex.: 3x por semana" {...register('weeklyFrequency')} />
          </Field>
          <Field label="Cobrança" htmlFor="cycle">
            <Select id="cycle" options={billingCycleOptions} {...register('cycle')} />
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" options={toOptions(planStatusLabels)} {...register('status')} />
          </Field>
        </FormGrid>
        <Field
          label="Benefícios"
          htmlFor="benefits"
          hint="Um benefício por linha — aparecem no card do plano."
        >
          <Textarea id="benefits" rows={4} placeholder={'Acesso total à musculação\nAvaliação física trimestral'} {...register('benefits')} />
        </Field>
        <Controller
          control={control}
          name="highlighted"
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onChange={field.onChange}
              label="Destacar plano"
              description="Exibe o selo de plano recomendado na listagem."
            />
          )}
        />
      </form>
    </Modal>
  );
}
