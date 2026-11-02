import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthSeriesPoint } from '@/interfaces/dashboard.interface';
import { formatCompactCurrency, formatCurrency } from '@/utils/format';
import { ChartTooltip } from './ChartTooltip';

export function RevenueChart({ data }: { data: MonthSeriesPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--app-accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--app-accent)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--app-info)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--app-info)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--app-fg-subtle)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--app-fg-subtle)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
            width={78}
          />
          <Tooltip content={<ChartTooltip formatter={formatCurrency} />} />
          <Area
            type="monotone"
            dataKey="receita"
            name="Receita"
            stroke="var(--app-accent)"
            strokeWidth={2}
            fill="url(#revenueFill)"
          />
          <Area
            type="monotone"
            dataKey="despesas"
            name="Despesas"
            stroke="var(--app-info)"
            strokeWidth={2}
            fill="url(#expenseFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
