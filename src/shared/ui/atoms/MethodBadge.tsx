import { cn } from '@/shared/lib/cn';

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400',
  POST: 'bg-blue-500/20 text-blue-400',
  PUT: 'bg-amber-500/20 text-amber-400',
  PATCH: 'bg-orange-500/20 text-orange-400',
  DELETE: 'bg-red-500/20 text-red-400',
};

type MethodBadgeProps = {
  method: string;
  className?: string;
};

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const upper = method.toUpperCase();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold font-mono',
        METHOD_COLORS[upper] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {upper}
    </span>
  );
}
