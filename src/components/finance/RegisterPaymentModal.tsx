import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PaymentMethod, PaymentView } from '@/interfaces/payment.interface';
import { paymentsService } from '@/services/api/payments.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { paymentMethodLabels, paymentMethodOptions } from '@/constants/labels';
import { formatCurrency } from '@/utils/format';
import { todayISO } from '@/utils/date';

const registerSchema = z.object({
  method: z.enum(['pix', 'cash', 'credit', 'debit', 'transfer']),
  paidAt: z.string().min(1, 'Informe a data'),
});

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterPaymentModalProps {
  payment: PaymentView | null;
  onClose: () => void;
  onSaved: () => void;
}

export function RegisterPaymentModal({ payment, onClose, onSaved }: RegisterPaymentModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, formState } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { method: 'pix', paidAt: todayISO() },
  });

  useEffect(() => {
    if (payment) reset({ method: payment.method ?? 'pix', paidAt: todayISO() });
  }, [payment, reset]);

  const method = watch('method');

  const { run, loading, error } = useAsyncAction(async (values: RegisterValues) => {
    if (!payment) return;
    await paymentsService.register(payment.id, values.method as PaymentMethod, values.paidAt);
  });

  const onSubmit = async (values: RegisterValues) => {
    if (!payment) return;
    const success = await run(values);
    if (!success) return;
    toast('Pagamento registrado', {
      description: `${payment.studentName} · ${formatCurrency(payment.amount)} via ${paymentMethodLabels[method]}.`,
    });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={!!payment}
      onClose={onClose}
      title="Registrar pagamento"
      description={
        payment
          ? `${payment.studentName} · ${payment.description} · ${formatCurrency(payment.amount)}`
          : undefined
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="register-payment-form" loading={loading}>
            Confirmar recebimento
          </Button>
        </>
      }
    >
      <form id="register-payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}
        <Field label="Forma de pagamento" htmlFor="paymentMethod" error={formState.errors.method?.message} required>
          <Select id="paymentMethod" options={paymentMethodOptions} {...register('method')} />
        </Field>
        <Field label="Data do recebimento" htmlFor="paymentDate" error={formState.errors.paidAt?.message} required>
          <Input id="paymentDate" type="date" {...register('paidAt')} />
        </Field>
      </form>
    </Modal>
  );
}
