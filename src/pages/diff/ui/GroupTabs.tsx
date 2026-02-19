import { cn } from '@/shared/lib/cn';

export type DiffGroup = 'api' | 'internal';

type GroupTabsProps = {
  active: DiffGroup;
  onChange: (group: DiffGroup) => void;
  apiCount: number;
  internalCount: number;
};

export function GroupTabs({ active, onChange, apiCount, internalCount }: GroupTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
      <TabButton
        active={active === 'api'}
        onClick={() => onChange('api')}
        label="API"
        count={apiCount}
      />
      <TabButton
        active={active === 'internal'}
        onClick={() => onChange('internal')}
        label="Internal"
        count={internalCount}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      {count > 0 && (
        <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
      )}
    </button>
  );
}
