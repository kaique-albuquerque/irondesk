import type { EnrollmentView } from '@/interfaces/enrollment.interface';

const cards = [
  { key: 'active', label: 'Ativas', tone: 'text-success' },
  { key: 'expiring', label: 'Vencendo', tone: 'text-warning' },
  { key: 'expired', label: 'Vencidas', tone: 'text-danger' },
  { key: 'cancelled', label: 'Canceladas', tone: 'text-subtle' },
] as const;

export function EnrollmentStats({ enrollments }: { enrollments: EnrollmentView[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const count = enrollments.filter((item) => item.displayStatus === card.key).length;
        return (
          <div key={card.key} className="panel flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">{card.label}</span>
            <span className={`text-lg font-semibold tnum ${card.tone}`}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}
