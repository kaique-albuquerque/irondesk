import { z } from 'zod';
import type { Settings } from '@/interfaces/settings.interface';

export const settingsSchema = z.object({
  academyName: z.string().trim().min(3, 'Informe o nome da academia'),
  legalName: z.string().trim().min(3, 'Informe a razão social'),
  cnpj: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, '').length === 14, 'Informe um CNPJ com 14 dígitos'),
  phone: z.string().trim().min(8, 'Informe o telefone'),
  email: z.string().trim().email('Informe um e-mail válido'),
  address: z.string().trim().min(6, 'Informe o endereço'),
  weekday: z.string().trim().min(3, 'Informe o horário'),
  saturday: z.string().trim().min(3, 'Informe o horário'),
  sunday: z.string().trim().min(3, 'Informe o horário'),
  defaultDueDay: z
    .number({ invalid_type_error: 'Informe o dia' })
    .int()
    .min(1, 'Entre 1 e 28')
    .max(28, 'Entre 1 e 28'),
  lateFeePercent: z.number({ invalid_type_error: 'Informe a multa' }).min(0).max(100),
  notifyExpiringDays: z
    .number({ invalid_type_error: 'Informe os dias' })
    .int()
    .min(1, 'Mínimo de 1 dia')
    .max(90, 'Máximo de 90 dias'),
  theme: z.enum(['dark', 'light']),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export function toSettingsFormValues(settings: Settings): SettingsFormValues {
  return {
    academyName: settings.academyName,
    legalName: settings.legalName,
    cnpj: settings.cnpj,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    weekday: settings.businessHours.weekday,
    saturday: settings.businessHours.saturday,
    sunday: settings.businessHours.sunday,
    defaultDueDay: settings.defaultDueDay,
    lateFeePercent: settings.lateFeePercent,
    notifyExpiringDays: settings.notifyExpiringDays,
    theme: settings.theme,
  };
}

export function toSettings(values: SettingsFormValues): Settings {
  return {
    academyName: values.academyName.trim(),
    legalName: values.legalName.trim(),
    cnpj: values.cnpj.trim(),
    phone: values.phone.trim(),
    email: values.email.trim().toLowerCase(),
    address: values.address.trim(),
    businessHours: {
      weekday: values.weekday.trim(),
      saturday: values.saturday.trim(),
      sunday: values.sunday.trim(),
    },
    defaultDueDay: values.defaultDueDay,
    lateFeePercent: values.lateFeePercent,
    notifyExpiringDays: values.notifyExpiringDays,
    theme: values.theme,
  };
}
