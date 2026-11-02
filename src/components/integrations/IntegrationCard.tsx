import {
  CalendarDays,
  CreditCard,
  DoorOpen,
  MessageCircle,
  Scale,
  StickyNote,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IntegrationState } from '@/interfaces/settings.interface';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

const ICONS: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  pagseguro: CreditCard,
  'google-calendar': CalendarDays,
  catraca: DoorOpen,
  balanca: Scale,
  notion: StickyNote,
};

const STATUS_LABEL: Record<IntegrationState['status'], string> = {
  connected: 'Conectado',
  disconnected: 'Desconectado',
  not_configured: 'Não configurado',
};

const STATUS_TONE: Record<IntegrationState['status'], 'success' | 'neutral' | 'warning'> = {
  connected: 'success',
  disconnected: 'neutral',
  not_configured: 'warning',
};

interface IntegrationCardProps {
  integration: IntegrationState;
  busy: boolean;
  onToggle: (integration: IntegrationState) => void;
}

export function IntegrationCard({ integration, busy, onToggle }: IntegrationCardProps) {
  const Icon = ICONS[integration.id] ?? MessageCircle;
  const connected = integration.status === 'connected';

  return (
    <article className="panel flex flex-col gap-4 p-5">
      <header className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-ink">{integration.name}</h3>
          <p className="text-[11px] uppercase tracking-wide text-subtle">{integration.category}</p>
        </div>
        <Badge tone={STATUS_TONE[integration.status]}>{STATUS_LABEL[integration.status]}</Badge>
      </header>

      <p className="flex-1 text-xs leading-relaxed text-muted">{integration.description}</p>

      <footer className="flex items-center justify-between border-t border-line pt-4">
        <Toggle
          checked={connected}
          disabled={busy}
          label={connected ? 'Ativa' : 'Inativa'}
          onChange={() => onToggle(integration)}
        />
        <Button variant="ghost" size="sm" onClick={() => onToggle(integration)} loading={busy}>
          {connected ? 'Desconectar' : 'Conectar'}
        </Button>
      </footer>
    </article>
  );
}
