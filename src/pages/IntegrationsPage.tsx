import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import type { IntegrationState } from '@/interfaces/settings.interface';
import { integrationsService } from '@/services/api/integrations.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CardsSkeleton } from '@/components/ui/Skeleton';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';

export function IntegrationsPage() {
  const { toast } = useToast();
  const { data, loading } = useAsyncData(() => integrationsService.list(), []);
  const [integrations, setIntegrations] = useState<IntegrationState[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (data) setIntegrations(data);
  }, [data]);

  const handleToggle = async (integration: IntegrationState) => {
    setBusyId(integration.id);
    try {
      const next = await integrationsService.toggle(integration.id);
      setIntegrations(next);
      const updated = next.find((item) => item.id === integration.id);
      toast(updated?.status === 'connected' ? 'Integração conectada' : 'Integração desconectada', {
        description: integration.name,
        tone: updated?.status === 'connected' ? 'success' : 'info',
      });
    } finally {
      setBusyId(null);
    }
  };

  const connected = integrations.filter((item) => item.status === 'connected').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrações"
        description="Conecte os serviços que sua academia já usa. Tudo é simulado para fins de demonstração."
      />

      <Card>
        <CardBody className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
            <Info className="size-4" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink">Ambiente de demonstração</p>
            <p className="text-xs leading-relaxed text-muted">
              O IronDesk não envia requisições reais nem armazena credenciais. As chaves de API são ilustrativas e
              ficam apenas no LocalStorage do seu navegador. {connected} de {integrations.length} integrações estão
              ativas.
            </p>
          </div>
        </CardBody>
      </Card>

      {loading && !data ? (
        <CardsSkeleton count={6} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              busy={busyId === integration.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <Card>
        <CardHeader title="Como conectar" description="Fluxo previsto para a versão integrada do produto." />
        <CardBody className="grid gap-4 text-xs text-muted md:grid-cols-3">
          <p>
            <span className="font-semibold text-ink">1. Escolha o serviço.</span> Ative a integração desejada no
            painel acima.
          </p>
          <p>
            <span className="font-semibold text-ink">2. Informe as chaves.</span> Cada parceiro exige um token de API
            ou número de telefone verificado.
          </p>
          <p>
            <span className="font-semibold text-ink">3. Automatize.</span> Lembretes de vencimento, liberação de
            catraca e relatórios passam a rodar sozinhos.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
