import { cn } from '@/shared/lib/cn';

import type { DiffSummary } from '@/shared/types';

type DiffSummaryBarProps = {
  summary: DiffSummary;
  className?: string;
};

const ITEMS: {
  key: keyof DiffSummary;
  label: string;
  prefix: string;
  color: string;
}[] = [
  { key: 'added', label: 'added', prefix: '+', color: 'text-success' },
  { key: 'removed', label: 'removed', prefix: '-', color: 'text-destructive' },
  { key: 'modified', label: 'modified', prefix: '', color: 'text-warning' },
  { key: 'breaking', label: 'breaking', prefix: '', color: 'text-destructive' },
];

export function DiffSummaryBar({ summary, className }: DiffSummaryBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-3',
        className,
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">Summary</span>
      <div className="flex flex-wrap gap-3">
        {ITEMS.map(({ key, label, prefix, color }) => (
          <span key={key} className="flex items-center gap-1.5 text-sm">
            <span className={cn('font-mono font-bold', color)}>
              {prefix}{summary[key]}
            </span>
            <span className="text-muted-foreground">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
