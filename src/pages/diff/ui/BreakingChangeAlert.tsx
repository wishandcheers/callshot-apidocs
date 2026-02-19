import { AlertTriangle } from 'lucide-react';

type BreakingChangeAlertProps = {
  count: number;
};

export function BreakingChangeAlert({ count }: BreakingChangeAlertProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
      <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="text-sm font-semibold text-destructive">
          {count} Breaking Change{count > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-destructive/80">
          This version contains changes that may affect existing integrations.
        </p>
      </div>
    </div>
  );
}
