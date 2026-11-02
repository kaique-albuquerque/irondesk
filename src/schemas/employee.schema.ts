import { z } from 'zod';
import type { EmployeeInput } from '@/interfaces/employee.interface';

export const employeeSchema = z.object({
  name: z.string().trim().min(3, 'Informe o nome do colaborador'),
  role: z.enum(['professor', 'personal', 'receptionist', 'manager', 'admin']),
  phone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, '').length >= 10, 'Informe um telefone com DDD'),
  email: z.string().trim().email('Informe um e-mail válido'),
  hiredAt: z.string().min(1, 'Informe a data de contratação'),
  status: z.enum(['active', 'inactive']),
  notes: z.string(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const employeeDefaults: EmployeeFormValues = {
  name: '',
  role: 'professor',
  phone: '',
  email: '',
  hiredAt: '',
  status: 'active',
  notes: '',
};

export function toEmployeeInput(values: EmployeeFormValues): EmployeeInput {
  return {
    name: values.name.trim(),
    role: values.role,
    phone: values.phone.trim(),
    email: values.email.trim().toLowerCase(),
    hiredAt: values.hiredAt,
    status: values.status,
    notes: values.notes.trim(),
  };
}

export function toEmployeeFormValues(employee: EmployeeInput): EmployeeFormValues {
  return { ...employee };
}
