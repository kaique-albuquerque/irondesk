export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(value: string, days: number): string {
  const date = parseISODate(value);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function addMonths(value: string, months: number): string {
  const date = parseISODate(value);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return toISODate(date);
}

export function startOfMonth(value: string): string {
  const date = parseISODate(value);
  return toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonth(value: string): string {
  const date = parseISODate(value);
  return toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function daysBetween(from: string, to: string): number {
  const diff = parseISODate(to).getTime() - parseISODate(from).getTime();
  return Math.round(diff / 86_400_000);
}

export function isWithin(value: string, from: string, to: string): boolean {
  return value >= from && value <= to;
}

export function monthKey(value: string): string {
  return value.slice(0, 7);
}

export function lastMonthKeys(count: number, reference = new Date()): string[] {
  const keys: string[] = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(reference.getFullYear(), reference.getMonth() - index, 1);
    keys.push(`${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`);
  }
  return keys;
}

export function formatDateBR(value: string | null | undefined): string {
  if (!value) return '—';
  const [datePart] = value.split('T');
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return '—';
  return `${day}/${month}/${year}`;
}

export function formatTimeBR(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTimeBR(value: string | null | undefined): string {
  if (!value) return '—';
  return `${formatDateBR(value)} · ${formatTimeBR(value)}`;
}

export function formatMonthShort(monthKeyValue: string): string {
  const [year, month] = monthKeyValue.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'short' });
  return label.replace('.', '');
}

export function formatMonthLong(monthKeyValue: string): string {
  const [year, month] = monthKeyValue.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
