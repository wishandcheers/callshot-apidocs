import { cn } from '@/shared/lib/cn';

export type ChangeFilter = 'all' | 'breaking' | 'added' | 'modified' | 'removed';

const FILTERS: { value: ChangeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'breaking', label: 'Breaking' },
  { value: 'added', label: 'Added' },
  { value: 'removed', label: 'Removed' },
  { value: 'modified', label: 'Modified' },
];

type ChangelogFiltersProps = {
  active: ChangeFilter;
  onChange: (filter: ChangeFilter) => void;
};

export function ChangelogFilters({ active, onChange }: ChangelogFiltersProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            active === value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
