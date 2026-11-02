import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Settings, Sun, UserRound } from 'lucide-react';
import { navigation } from '@/constants/navigation';
import { DEMO_USER } from '@/constants/app';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { Brand } from './Brand';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsMenu } from './NotificationsMenu';

function currentTitle(pathname: string): string {
  const match = navigation
    .flatMap((group) => group.items)
    .filter((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to) && item.to !== '/'))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return match?.label ?? 'Dashboard';
}

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        <div className="lg:hidden">
          <Brand compact />
        </div>
        <p className="hidden text-sm font-semibold text-ink lg:block">{currentTitle(pathname)}</p>

        <div className="ml-auto flex items-center gap-2">
          <GlobalSearch />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
            className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition-colors hover:text-ink"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <NotificationsMenu />
          <Dropdown
            trigger={<Avatar name={DEMO_USER.name} />}
            items={[
              {
                label: 'Perfil da academia',
                icon: <UserRound className="size-3.5" />,
                onClick: () => navigate('/configuracoes'),
              },
              {
                label: 'Configurações',
                icon: <Settings className="size-3.5" />,
                onClick: () => navigate('/configuracoes'),
              },
              {
                label: 'Sair da demonstração',
                icon: <LogOut className="size-3.5" />,
                danger: true,
                onClick: () =>
                  toast('Sessão de demonstração', {
                    description: 'Este ambiente não possui autenticação real.',
                    tone: 'info',
                  }),
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
