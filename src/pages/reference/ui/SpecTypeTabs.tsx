import { cn } from '@/shared/lib/cn';

export type SpecType = 'api' | 'admin';

type SpecTypeTabsProps = {
  active: SpecType;
  onChange: (type: SpecType) => void;
};

export function SpecTypeTabs({ active, onChange }: SpecTypeTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
      <TabButton
        active={active === 'api'}
        onClick={() => onChange('api')}
        label="API"
      />
      <TabButton
        active={active === 'admin'}
        onClick={() => onChange('admin')}
        label="Admin"
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
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
    </button>
  );
}
