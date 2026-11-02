import { NavLink } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { navigation } from '@/constants/navigation';
import { DEMO_USER } from '@/constants/app';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Brand } from './Brand';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col border-r border-line bg-surface transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Brand onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-lg p-1.5 text-subtle hover:bg-surface-2 hover:text-ink lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-[0.12em] text-subtle uppercase">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent-soft text-accent-ink'
                            : 'text-muted hover:bg-surface-2 hover:text-ink',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={cn('size-4 shrink-0', isActive ? 'text-accent-ink' : 'text-subtle')}
                            strokeWidth={2}
                          />
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-line px-3 py-3">
          <div className="rounded-xl border border-line bg-surface-2 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
              <Sparkles className="size-3.5 text-accent" />
              Modo demonstração
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Todos os dados são fictícios e ficam salvos apenas neste navegador.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-1 pb-1">
            <Avatar name={DEMO_USER.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{DEMO_USER.name}</p>
              <p className="truncate text-[11px] text-subtle">{DEMO_USER.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
