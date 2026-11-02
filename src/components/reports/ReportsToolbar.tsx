import { Download } from 'lucide-react';
import type { MonthSeriesPoint } from '@/interfaces/dashboard.interface';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { downloadCsv } from '@/utils/csv';
import { todayISO } from '@/utils/date';

const PERIOD_OPTIONS = [
  { value: '3', label: 'Últimos 3 meses' },
  { value: '6', label: 'Últimos 6 meses' },
  { value: '12', label: 'Últimos 12 meses' },
];

interface ReportsToolbarProps {
  months: number;
  onMonthsChange: (months: number) => void;
  series: MonthSeriesPoint[];
  disabled?: boolean;
}

export function ReportsToolbar({ months, onMonthsChange, series, disabled }: ReportsToolbarProps) {
  const handleExport = () => {
    downloadCsv(`irondesk-relatorio-${todayISO()}.csv`, series, [
      { header: 'Mês', value: (row) => row.month },
      { header: 'Receita', value: (row) => row.receita.toFixed(2).replace('.', ',') },
      { header: 'Despesas', value: (row) => row.despesas.toFixed(2).replace('.', ',') },
      { header: 'Resultado', value: (row) => (row.receita - row.despesas).toFixed(2).replace('.', ',') },
    ]);
  };

  return (
    <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Select
          aria-label="Período do relatório"
          value={String(months)}
          onChange={(event) => onMonthsChange(Number(event.target.value))}
          options={PERIOD_OPTIONS}
          className="w-48"
        />
        <span className="text-xs text-subtle">
          {series.length} {series.length === 1 ? 'competência' : 'competências'}
        </span>
      </div>
      <Button
        variant="secondary"
        icon={<Download className="size-4" />}
        onClick={handleExport}
        disabled={disabled || series.length === 0}
      >
        Exportar CSV
      </Button>
    </div>
  );
}
