import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import type { Settings } from '@/interfaces/settings.interface';
import { settingsService } from '@/services/api/settings.service';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { DEMO_USER } from '@/constants/app';

export function SettingsPage() {
  const { toast } = useToast();
  const { data, loading, reload } = useAsyncData(() => settingsService.get(), []);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { run: resetData, loading: resetting } = useAsyncAction(settingsService.resetDemoData);

  const handleReset = async () => {
    const success = await resetData();
    if (success) {
      await reload();
      toast('Dados de demonstração recriados', { description: 'Alunos, matrículas e lançamentos voltaram ao padrão.' });
    }
    setConfirmOpen(false);
  };

  const handleSaved = (saved: Settings) => {
    void reload();
    document.title = `${saved.academyName} · IronDesk`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Personalize os dados da academia, regras financeiras e aparência do sistema."
        actions={
          <Button type="submit" form="settings-form" icon={<Save className="size-4" />}>
            Salvar alterações
          </Button>
        }
      />

      <Card>
        <CardHeader title="Preferências da academia" description="Aplicadas em todo o painel do IronDesk." />
        <CardBody>
          {loading && !data ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-2/3" />
            </div>
          ) : data ? (
            <SettingsForm settings={data} onSaved={handleSaved} />
          ) : null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Usuário demonstrado" description="Conta usada para ilustrar o acesso ao sistema." />
        <CardBody className="grid gap-4 text-xs text-muted sm:grid-cols-3">
          <p>
            <span className="block text-[11px] uppercase tracking-wide text-subtle">Nome</span>
            <span className="text-sm font-medium text-ink">{DEMO_USER.name}</span>
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-wide text-subtle">E-mail</span>
            <span className="text-sm font-medium text-ink">{DEMO_USER.email}</span>
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-wide text-subtle">Perfil</span>
            <span className="text-sm font-medium text-ink">{DEMO_USER.role}</span>
          </p>
        </CardBody>
      </Card>

      <Card className="border-danger/30">
        <CardHeader
          title="Zona de risco"
          description="Recria a base local com dados fictícios de demonstração."
        />
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            Todas as alterações salvas em alunos, planos, matrículas, pagamentos, treinos e avaliações serão
            descartadas. Use quando quiser voltar ao estado original do portfólio.
          </p>
          <Button
            variant="danger"
            icon={<RotateCcw className="size-4" />}
            onClick={() => setConfirmOpen(true)}
            loading={resetting}
          >
            Restaurar dados
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Restaurar dados de demonstração"
        description="Isso apaga tudo que foi criado neste navegador e recarrega a base fictícia do IronDesk."
        confirmLabel="Restaurar"
        tone="danger"
        loading={resetting}
        onConfirm={handleReset}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
