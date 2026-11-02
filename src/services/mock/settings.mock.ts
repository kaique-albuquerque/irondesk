import type { Settings } from '@/interfaces/settings.interface';

export const seedSettings: Settings = {
  academyName: 'IronDesk Academia',
  legalName: 'IronDesk Treinamento Físico Ltda.',
  cnpj: '12.345.678/0001-90',
  phone: '1132457800',
  email: 'contato@irondesk.demo',
  address: 'Av. Paulista, 1842 — Bela Vista, São Paulo/SP',
  businessHours: {
    weekday: '06:00 às 23:00',
    saturday: '08:00 às 18:00',
    sunday: '08:00 às 13:00',
  },
  defaultDueDay: 10,
  lateFeePercent: 2,
  theme: 'dark',
  notifyExpiringDays: 7,
};
