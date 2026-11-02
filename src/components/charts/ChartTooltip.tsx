interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  formatter?: (value: number) => string;
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-panel">
      {label !== undefined ? (
        <p className="mb-1 text-[11px] font-semibold tracking-wide text-subtle uppercase">{label}</p>
      ) : null}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.dataKey ?? item.name}`} className="flex items-center gap-2 text-xs">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted">{item.name}</span>
            <span className="ml-auto font-medium text-ink tnum">
              {typeof item.value === 'number' && formatter ? formatter(item.value) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
