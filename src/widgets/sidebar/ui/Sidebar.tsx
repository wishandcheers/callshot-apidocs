import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScrollText,
  GitCompareArrows,
  BookOpen,
} from 'lucide-react';

import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/changelog', label: 'Changelog', icon: ScrollText },
  { to: '/diff', label: 'Diff View', icon: GitCompareArrows },
  { to: '/reference', label: 'API Reference', icon: BookOpen },
] as const;

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <GitCompareArrows className="h-5 w-5 text-primary" />
        <span className="text-sm font-bold text-foreground">
          CallShot API
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">gloview-api</p>
      </div>
    </aside>
  );
}
