import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Settings } from '@/interfaces/settings.interface';
import { settingsSchema, toSettings, toSettingsFormValues } from '@/schemas/settings.schema';
import type { SettingsFormValues } from '@/schemas/settings.schema';
import { settingsService } from '@/services/api/settings.service';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/hooks/useTheme';
import { Field, FormGrid } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Escuro (padrão)' },
  { value: 'light', label: 'Claro' },
];

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-b border-line pb-6 last:border-none last:pb-0">
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

interface SettingsFormProps {
  settings: Settings;
  onSaved: (settings: Settings) => void;
}

export function SettingsForm({ settings, onSaved }: SettingsFormProps) {
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const { register, handleSubmit, formState } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: toSettingsFormValues(settings),
  });
  const errors = formState.errors;

  const { run, loading, error } = useAsyncAction(async (values: SettingsFormValues) => {
    const saved = await settingsService.update(toSettings(values));
    setTheme(saved.theme);
    onSaved(saved);
    return saved;
  });

  const onSubmit = async (values: SettingsFormValues) => {
    const success = await run(values);
    if (success) toast('Configurações salvas', { description: 'As alterações já valem para toda a academia.' });
  };

  return (
    <form id="settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}

      <Section title="Dados da academia" description="Informações usadas em recibos, contratos e comunicações.">
        <FormGrid>
          <Field label="Nome fantasia" error={errors.academyName?.message} required>
            <Input placeholder="IronDesk Academia" {...register('academyName')} />
          </Field>
          <Field label="Razão social" error={errors.legalName?.message} required>
            <Input placeholder="IronDesk Fitness LTDA" {...register('legalName')} />
          </Field>
          <Field label="CNPJ" error={errors.cnpj?.message} required>
            <Input placeholder="12.345.678/0001-90" {...register('cnpj')} />
          </Field>
          <Field label="Telefone" error={errors.phone?.message} required>
            <Input placeholder="(11) 4002-8922" {...register('phone')} />
          </Field>
          <Field label="E-mail" error={errors.email?.message} required>
            <Input type="email" placeholder="contato@irondesk.app" {...register('email')} />
          </Field>
          <Field label="Endereço" error={errors.address?.message} required>
            <Input placeholder="Av. Paulista, 1000 - São Paulo" {...register('address')} />
          </Field>
        </FormGrid>
        <FormGrid>
          <Field label="Segunda a sexta" error={errors.weekday?.message}>
            <Input placeholder="06:00 - 23:00" {...register('weekday')} />
          </Field>
          <Field label="Sábado" error={errors.saturday?.message}>
            <Input placeholder="08:00 - 18:00" {...register('saturday')} />
          </Field>
          <Field label="Domingo" error={errors.sunday?.message}>
            <Input placeholder="08:00 - 12:00" {...register('sunday')} />
          </Field>
        </FormGrid>
      </Section>

      <Section title="Regras financeiras" description="Padrões aplicados ao gerar mensalidades e cobranças.">
        <FormGrid>
          <Field label="Dia de vencimento" error={errors.defaultDueDay?.message}>
            <Input type="number" min={1} max={28} {...register('defaultDueDay', { valueAsNumber: true })} />
          </Field>
          <Field label="Multa por atraso (%)" error={errors.lateFeePercent?.message}>
            <Input type="number" min={0} max={100} step="0.5" {...register('lateFeePercent', { valueAsNumber: true })} />
          </Field>
          <Field label="Avisar antes do vencimento (dias)" error={errors.notifyExpiringDays?.message}>
            <Input type="number" min={1} max={90} {...register('notifyExpiringDays', { valueAsNumber: true })} />
          </Field>
          <Field label="Tema do sistema" error={errors.theme?.message}>
            <Select options={THEME_OPTIONS} {...register('theme')} />
          </Field>
        </FormGrid>
      </Section>

      <button type="submit" className="sr-only" disabled={loading}>
        Salvar
      </button>
    </form>
  );
}
