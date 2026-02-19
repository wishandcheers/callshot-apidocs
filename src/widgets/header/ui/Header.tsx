import { useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/changelog': 'Changelog',
  '/diff': 'Diff View',
  '/reference': 'API Reference',
};

export function Header() {
  const { pathname } = useLocation();
  const baseRoute = '/' + (pathname.split('/')[1] ?? '');
  const title = PAGE_TITLES[baseRoute] ?? 'CallShot API Docs';

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
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
