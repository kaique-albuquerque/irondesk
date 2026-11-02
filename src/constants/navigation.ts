import {
  Activity,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Plug,
  Ruler,
  Settings,
  Tags,
  Users,
  UserSquare2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: 'Operação',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
      { label: 'Alunos', to: '/alunos', icon: Users },
      { label: 'Matrículas', to: '/matriculas', icon: ClipboardList },
      { label: 'Frequência', to: '/frequencia', icon: CalendarCheck },
    ],
  },
  {
    label: 'Relacionamento',
    items: [
      { label: 'Planos', to: '/planos', icon: Tags },
      { label: 'Treinos', to: '/treinos', icon: Dumbbell },
      { label: 'Avaliações', to: '/avaliacoes', icon: Ruler },
    ],
  },
  {
    label: 'Administração',
    items: [
      { label: 'Financeiro', to: '/financeiro', icon: CreditCard },
      { label: 'Relatórios', to: '/relatorios', icon: BarChart3 },
      { label: 'Equipe', to: '/equipe', icon: UserSquare2 },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Integrações', to: '/integracoes', icon: Plug },
      { label: 'Configurações', to: '/configuracoes', icon: Settings },
    ],
  },
];

export const brandMarkIcon = Activity;
