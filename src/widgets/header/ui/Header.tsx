import { useLocation } from 'react-router-dom';
import { ExternalLink, Menu } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/changelog': 'Changelog',
  '/diff': 'Diff View',
  '/reference': 'API Reference',
};

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const baseRoute = '/' + (pathname.split('/')[1] ?? '');
  const title = PAGE_TITLES[baseRoute] ?? 'CallShot API Docs';

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <a
        href="https://github.com/kodari-corp/gloview"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Source
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </header>
  );
}
