import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { EnrollmentView } from '@/interfaces/enrollment.interface';
import type { Student } from '@/interfaces/student.interface';
import { paymentDefaults, paymentSchema, toPaymentInput } from '@/schemas/payment.schema';
import type { PaymentFormValues } from '@/schemas/payment.schema';
import { paymentsService } from '@/services/api/payments.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { paymentMethodOptions, paymentStatusLabels, toOptions } from '@/constants/labels';
import { formatCurrency } from '@/utils/format';
import { todayISO } from '@/utils/date';

interface PaymentFormModalProps {
  open: boolean;
  students: Student[];
  enrollments: EnrollmentView[];
  presetStudentId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function PaymentFormModal({
  open,
  students,
  enrollments,
  presetStudentId,
  onClose,
  onSaved,
}: PaymentFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { ...paymentDefaults, dueDate: todayISO() },
  });

  const eligible = useMemo(
    () => enrollments.filter((item) => item.displayStatus !== 'cancelled'),
    [enrollments],
  );
  const eligibleStudents = useMemo(
    () => students.filter((student) => eligible.some((item) => item.studentId === student.id)),
    [students, eligible],
  );

  const studentId = watch('studentId');
  const activeEnrollment = eligible.find((item) => item.studentId === studentId) ?? null;

  useEffect(() => {
    if (open) reset({ ...paymentDefaults, dueDate: todayISO(), studentId: presetStudentId ?? '' });
  }, [open, presetStudentId, reset]);

  useEffect(() => {
    if (!activeEnrollment) return;
    setValue('amount', activeEnrollment.contractedValue);
    setValue('dueDate', activeEnrollment.dueDate);
  }, [activeEnrollment, setValue]);

  const { run, loading, error } = useAsyncAction(async (values: PaymentFormValues) => {
    if (!activeEnrollment) throw new Error('Aluno sem matrícula ativa.');
    await paymentsService.create(toPaymentInput(values, activeEnrollment.id));
  });

  const onSubmit = async (values: PaymentFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast('Lançamento criado', { description: `${values.description} · ${formatCurrency(values.amount)}` });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo lançamento financeiro"
      description="Crie uma cobrança avulsa ou mensalidade vinculada à matrícula do aluno."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="payment-form" loading={loading} disabled={!activeEnrollment}>
            Criar lançamento
          </Button>
        </>
      }
    >
      <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}

        <Field label="Aluno" error={formState.errors.studentId?.message} required>
          <Select
            placeholder="Selecione o aluno com matrícula ativa"
            options={eligibleStudents.map((student) => ({ value: student.id, label: student.name }))}
            {...register('studentId')}
          />
        </Field>

        {studentId && !activeEnrollment ? (
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
            Este aluno não possui matrícula ativa. Crie uma matrícula antes de lançar cobranças.
          </p>
        ) : null}

        <FormGrid>
          <Field label="Descrição" error={formState.errors.description?.message} required>
            <Input placeholder="Mensalidade" {...register('description')} />
          </Field>
          <Field label="Valor (R$)" error={formState.errors.amount?.message} required>
            <Input type="number" step="0.01" min={0} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Vencimento" error={formState.errors.dueDate?.message} required>
            <Input type="date" {...register('dueDate')} />
          </Field>
          <Field label="Situação" error={formState.errors.status?.message}>
            <Select
              options={toOptions(paymentStatusLabels).filter(
                (option) => option.value !== 'late' && option.value !== 'paid',
              )}
              {...register('status')}
            />
          </Field>
          <Field label="Forma de pagamento" error={formState.errors.method?.message}>
            <Select options={paymentMethodOptions} {...register('method')} />
          </Field>
        </FormGrid>

        {activeEnrollment ? (
          <p className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-muted">
            Matrícula: <span className="text-ink">{activeEnrollment.planName}</span> · valor contratado{' '}
            <span className="text-ink tnum">{formatCurrency(activeEnrollment.contractedValue)}</span>
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
