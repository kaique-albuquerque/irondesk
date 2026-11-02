export type AccentTone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const accentText: Record<AccentTone, string> = {
  accent: 'text-accent-ink',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  neutral: 'text-muted',
};

export const accentBgSoft: Record<AccentTone, string> = {
  accent: 'bg-accent-soft',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-danger/10',
  info: 'bg-info/10',
  neutral: 'bg-surface-3',
};

export const accentStroke: Record<AccentTone, string> = {
  accent: 'var(--app-accent)',
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  danger: 'var(--app-danger)',
  info: 'var(--app-info)',
  neutral: 'var(--app-fg-subtle)',
};

export const chartPalette = [
  'var(--app-accent)',
  'var(--app-info)',
  'var(--app-success)',
  'var(--app-warning)',
  'var(--app-danger)',
  'var(--app-border-strong)',
];
