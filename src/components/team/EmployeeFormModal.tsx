import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Employee } from '@/interfaces/employee.interface';
import {
  employeeDefaults,
  employeeSchema,
  toEmployeeFormValues,
  toEmployeeInput,
} from '@/schemas/employee.schema';
import type { EmployeeFormValues } from '@/schemas/employee.schema';
import { employeesService } from '@/services/api/employees.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { employeeRoleOptions, employeeStatusLabels, toOptions } from '@/constants/labels';
import { todayISO } from '@/utils/date';

interface EmployeeFormModalProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EmployeeFormModal({ open, employee, onClose, onSaved }: EmployeeFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { ...employeeDefaults, hiredAt: todayISO() },
  });

  useEffect(() => {
    if (!open) return;
    reset(employee ? toEmployeeFormValues(employee) : { ...employeeDefaults, hiredAt: todayISO() });
  }, [open, employee, reset]);

  const { run, loading, error } = useAsyncAction(async (values: EmployeeFormValues) => {
    const input = toEmployeeInput(values);
    if (employee) await employeesService.update(employee.id, input);
    else await employeesService.create(input);
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast(employee ? 'Colaborador atualizado' : 'Colaborador cadastrado', { description: values.name });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={employee ? 'Editar colaborador' : 'Novo colaborador'}
      description="Cadastre professores, recepção e gestores com seus dados de contato."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="employee-form" loading={loading}>
            {employee ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
        </>
      }
    >
      <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}
        <FormGrid>
          <Field label="Nome completo" error={formState.errors.name?.message} required>
            <Input placeholder="Marina Costa" {...register('name')} />
          </Field>
          <Field label="Função" error={formState.errors.role?.message}>
            <Select options={employeeRoleOptions} {...register('role')} />
          </Field>
          <Field label="Telefone" error={formState.errors.phone?.message} required>
            <Input placeholder="(11) 99999-0000" {...register('phone')} />
          </Field>
          <Field label="E-mail" error={formState.errors.email?.message} required>
            <Input type="email" placeholder="marina@irondesk.app" {...register('email')} />
          </Field>
          <Field label="Contratação" error={formState.errors.hiredAt?.message} required>
            <Input type="date" {...register('hiredAt')} />
          </Field>
          <Field label="Status" error={formState.errors.status?.message}>
            <Select options={toOptions(employeeStatusLabels)} {...register('status')} />
          </Field>
        </FormGrid>
        <Field label="Observações" error={formState.errors.notes?.message}>
          <Textarea placeholder="Especialidades, horários, certificações..." {...register('notes')} />
        </Field>
      </form>
    </Modal>
  );
}
