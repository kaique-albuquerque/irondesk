import { z } from 'zod';
import type { StudentInput } from '@/interfaces/student.interface';

const digits = (value: string) => value.replace(/\D/g, '');

export const studentSchema = z.object({
  name: z.string().trim().min(3, 'Informe o nome completo do aluno'),
  cpf: z
    .string()
    .trim()
    .refine((value) => digits(value).length === 11, 'O CPF deve conter 11 dígitos'),
  birthDate: z.string().min(1, 'Informe a data de nascimento'),
  phone: z
    .string()
    .trim()
    .refine((value) => digits(value).length >= 10, 'Informe um telefone com DDD'),
  email: z.string().trim().email('Informe um e-mail válido'),
  street: z.string().trim().min(3, 'Informe a rua'),
  city: z.string().trim().min(2, 'Informe a cidade'),
  state: z.string().trim().length(2, 'Use a sigla do estado (ex.: SP)'),
  zipCode: z
    .string()
    .trim()
    .refine((value) => digits(value).length === 8, 'Informe um CEP válido'),
  planId: z.string(),
  status: z.enum(['active', 'inactive']),
  notes: z.string(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export const studentDefaults: StudentFormValues = {
  name: '',
  cpf: '',
  birthDate: '',
  phone: '',
  email: '',
  street: '',
  city: '',
  state: 'SP',
  zipCode: '',
  planId: '',
  status: 'active',
  notes: '',
};

export function toStudentInput(values: StudentFormValues): StudentInput {
  return {
    name: values.name.trim(),
    cpf: values.cpf.trim(),
    birthDate: values.birthDate,
    phone: values.phone.trim(),
    email: values.email.trim().toLowerCase(),
    address: {
      street: values.street.trim(),
      city: values.city.trim(),
      state: values.state.trim().toUpperCase(),
      zipCode: values.zipCode.trim(),
    },
    planId: values.planId || null,
    status: values.status,
    notes: values.notes.trim(),
  };
}

export function toStudentFormValues(student: StudentInput): StudentFormValues {
  return {
    name: student.name,
    cpf: student.cpf,
    birthDate: student.birthDate,
    phone: student.phone,
    email: student.email,
    street: student.address.street,
    city: student.address.city,
    state: student.address.state,
    zipCode: student.address.zipCode,
    planId: student.planId ?? '',
    status: student.status,
    notes: student.notes,
  };
}
