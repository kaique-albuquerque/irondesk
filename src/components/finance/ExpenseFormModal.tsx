import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Expense } from '@/interfaces/payment.interface';
import { expenseDefaults, expenseSchema, toExpenseInput } from '@/schemas/payment.schema';
import type { ExpenseFormValues } from '@/schemas/payment.schema';
import { expensesService } from '@/services/api/expenses.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { expenseCategoryOptions } from '@/constants/labels';
import { formatCurrency } from '@/utils/format';
import { todayISO } from '@/utils/date';

interface ExpenseFormModalProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ExpenseFormModal({ open, expense, onClose, onSaved }: ExpenseFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { ...expenseDefaults, date: todayISO() },
  });

  useEffect(() => {
    if (!open) return;
    reset(expense ? { ...expense } : { ...expenseDefaults, date: todayISO() });
  }, [open, expense, reset]);

  const { run, loading, error } = useAsyncAction(async (values: ExpenseFormValues) => {
    const input = toExpenseInput(values);
    if (expense) await expensesService.update(expense.id, input);
    else await expensesService.create(input);
  });

  const onSubmit = async (values: ExpenseFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast(expense ? 'Despesa atualizada' : 'Despesa registrada', {
      description: `${values.description} · ${formatCurrency(values.amount)}`,
    });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={expense ? 'Editar despesa' : 'Nova despesa'}
      description="Registre custos operacionais para acompanhar o resultado da academia."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="expense-form" loading={loading}>
            {expense ? 'Salvar alterações' : 'Registrar despesa'}
          </Button>
        </>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}
        <FormGrid>
          <Field label="Descrição" error={formState.errors.description?.message} required>
            <Input placeholder="Aluguel da unidade" {...register('description')} />
          </Field>
          <Field label="Categoria" error={formState.errors.category?.message}>
            <Select options={expenseCategoryOptions} {...register('category')} />
          </Field>
          <Field label="Valor (R$)" error={formState.errors.amount?.message} required>
            <Input type="number" step="0.01" min={0} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Data" error={formState.errors.date?.message} required>
            <Input type="date" {...register('date')} />
          </Field>
        </FormGrid>
        <Field label="Observações" error={formState.errors.notes?.message}>
          <Textarea placeholder="Detalhes do pagamento, fornecedor, nota fiscal..." {...register('notes')} />
        </Field>
      </form>
    </Modal>
  );
}
