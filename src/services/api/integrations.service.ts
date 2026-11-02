import type { IntegrationState } from '@/interfaces/settings.interface';
import { STORAGE_PREFIX } from '@/constants/app';
import { simulateLatency } from '@/services/api/helpers';
import { readStorage, writeStorage } from '@/services/storage/storage.service';

const INTEGRATIONS_KEY = `${STORAGE_PREFIX}:integrations`;

const DEFAULT_INTEGRATIONS: IntegrationState[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'Comunicação',
    description: 'Envie lembretes de vencimento e confirmações de aula automaticamente.',
    status: 'connected',
  },
  {
    id: 'pagseguro',
    name: 'PagSeguro',
    category: 'Pagamentos',
    description: 'Cobre mensalidades por cartão, Pix e boleto direto no sistema.',
    status: 'connected',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'Agenda',
    description: 'Sincronize avaliações físicas e aulas experimentais com a agenda da equipe.',
    status: 'disconnected',
  },
  {
    id: 'catraca',
    name: 'Catraca Eletrônica',
    category: 'Acesso',
    description: 'Libere a entrada do aluno automaticamente após validar a matrícula.',
    status: 'not_configured',
  },
  {
    id: 'balanca',
    name: 'Balança Digital Bluetooth',
    category: 'Avaliação',
    description: 'Importe peso e percentual de gordura direto para a avaliação física.',
    status: 'not_configured',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Gestão',
    description: 'Exporte relatórios operacionais para o workspace da academia.',
    status: 'disconnected',
  },
];

export const integrationsService = {
  async list(): Promise<IntegrationState[]> {
    await simulateLatency();
    return readStorage<IntegrationState[]>(INTEGRATIONS_KEY) ?? DEFAULT_INTEGRATIONS;
  },

  async toggle(id: string): Promise<IntegrationState[]> {
    await simulateLatency();
    const current = readStorage<IntegrationState[]>(INTEGRATIONS_KEY) ?? DEFAULT_INTEGRATIONS;
    const next = current.map((integration) =>
      integration.id === id
        ? { ...integration, status: integration.status === 'connected' ? 'disconnected' : 'connected' }
        : integration,
    ) as IntegrationState[];
    writeStorage(INTEGRATIONS_KEY, next);
    return next;
  },
};
