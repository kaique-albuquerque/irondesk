export type ThemePreference = 'dark' | 'light';

export interface BusinessHours {
  weekday: string;
  saturday: string;
  sunday: string;
}

export interface Settings {
  academyName: string;
  legalName: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  businessHours: BusinessHours;
  defaultDueDay: number;
  lateFeePercent: number;
  theme: ThemePreference;
  notifyExpiringDays: number;
}

export interface IntegrationState {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'disconnected' | 'not_configured';
}
