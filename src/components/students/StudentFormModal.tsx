import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Plan } from '@/interfaces/plan.interface';
import type { Student } from '@/interfaces/student.interface';
import {
  studentDefaults,
  studentSchema,
  toStudentFormValues,
  toStudentInput,
} from '@/schemas/student.schema';
import type { StudentFormValues } from '@/schemas/student.schema';
import { studentsService } from '@/services/api/students.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { studentStatusOptions } from '@/constants/labels';
import { formatPhone } from '@/utils/format';

interface StudentFormModalProps {
  open: boolean;
  student: Student | null;
  plans: Plan[];
  onClose: () => void;
  onSaved: () => void;
}

export function StudentFormModal({ open, student, plans, onClose, onSaved }: StudentFormModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: studentDefaults,
  });

  useEffect(() => {
    if (open) reset(student ? toStudentFormValues(student) : studentDefaults);
  }, [open, student, reset]);

  const { run, loading } = useAsyncAction(async (values: StudentFormValues) => {
    const input = toStudentInput(values);
    if (student) await studentsService.update(student.id, input);
    else await studentsService.create(input);
  });

  const onSubmit = async (values: StudentFormValues) => {
    const success = await run(values);
    if (!success) return;
    toast(student ? 'Aluno atualizado' : 'Aluno cadastrado', {
      description: values.name,
    });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={student ? 'Editar aluno' : 'Novo aluno'}
      description="Dados cadastrais usados em matrículas, treinos e cobranças."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="student-form" loading={loading}>
            {student ? 'Salvar alterações' : 'Cadastrar aluno'}
          </Button>
        </>
      }
    >
      <form id="student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Nome completo" htmlFor="name" error={formState.errors.name?.message} required>
          <Input id="name" placeholder="Ex.: Mariana Costa" invalid={!!formState.errors.name} {...register('name')} />
        </Field>
        <FormGrid>
          <Field label="CPF" htmlFor="cpf" error={formState.errors.cpf?.message} required>
            <Input id="cpf" placeholder="000.000.000-00" invalid={!!formState.errors.cpf} {...register('cpf')} />
          </Field>
          <Field label="Nascimento" htmlFor="birthDate" error={formState.errors.birthDate?.message} required>
            <Input id="birthDate" type="date" invalid={!!formState.errors.birthDate} {...register('birthDate')} />
          </Field>
          <Field label="Telefone" htmlFor="phone" error={formState.errors.phone?.message} required>
            <Input
              id="phone"
              placeholder={formatPhone('11987654321')}
              invalid={!!formState.errors.phone}
              {...register('phone')}
            />
          </Field>
          <Field label="E-mail" htmlFor="email" error={formState.errors.email?.message} required>
            <Input id="email" type="email" placeholder="aluno@email.com" invalid={!!formState.errors.email} {...register('email')} />
          </Field>
        </FormGrid>
        <FormGrid>
          <Field label="Rua e número" htmlFor="street" error={formState.errors.street?.message} required>
            <Input id="street" placeholder="Rua das Palmeiras, 120" invalid={!!formState.errors.street} {...register('street')} />
          </Field>
          <Field label="Cidade" htmlFor="city" error={formState.errors.city?.message} required>
            <Input id="city" placeholder="São Paulo" invalid={!!formState.errors.city} {...register('city')} />
          </Field>
          <Field label="Estado (UF)" htmlFor="state" error={formState.errors.state?.message} required>
            <Input id="state" placeholder="SP" maxLength={2} invalid={!!formState.errors.state} {...register('state')} />
          </Field>
          <Field label="CEP" htmlFor="zipCode" error={formState.errors.zipCode?.message} required>
            <Input id="zipCode" placeholder="00000-000" {...register('zipCode')} />
          </Field>
          <Field label="Plano atual" htmlFor="planId" hint="Opcional — defina na matrícula">
            <Select
              id="planId"
              placeholder="Sem plano"
              options={plans.map((plan) => ({ value: plan.id, label: plan.name }))}
              {...register('planId')}
            />
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" options={studentStatusOptions} {...register('status')} />
          </Field>
        </FormGrid>
        <Field label="Observações" htmlFor="notes">
          <Textarea id="notes" placeholder="Restrições, objetivos, preferências..." {...register('notes')} />
        </Field>
      </form>
    </Modal>
  );
}
