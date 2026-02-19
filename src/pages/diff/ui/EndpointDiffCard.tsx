import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Badge, MethodBadge } from '@/shared/ui/atoms';

import type { ChangelogEntry } from '@/shared/types';

type ChangeType = 'added' | 'removed' | 'modified';

type EndpointDiffCardProps = {
  path: string;
  methods: string[];
  changeType: ChangeType;
  changes: ChangelogEntry[];
};

const CHANGE_TYPE_BADGE: Record<ChangeType, { label: string; variant: 'success' | 'destructive' | 'warning' }> = {
  added: { label: 'ADDED', variant: 'success' },
  removed: { label: 'REMOVED', variant: 'destructive' },
  modified: { label: 'MODIFIED', variant: 'warning' },
};

export function EndpointDiffCard({ path, methods, changeType, changes }: EndpointDiffCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasBreaking = changes.some((c) => c.level >= 3);
  const badgeInfo = CHANGE_TYPE_BADGE[changeType];
  const hasDetails = changeType === 'modified' && changes.length > 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card',
        hasBreaking && 'border-destructive/30',
      )}
    >
      <button
        type="button"
        onClick={() => hasDetails && setExpanded(!expanded)}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3 text-left',
          hasDetails && 'cursor-pointer transition-colors hover:bg-muted/30',
          !hasDetails && 'cursor-default',
        )}
      >
        {hasDetails && (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        )}

        <div className="flex items-center gap-2">
          {methods.map((m) => (
            <MethodBadge key={m} method={m} />
          ))}
        </div>

        <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
          {path}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
          {hasBreaking && (
            <Badge variant="destructive">BREAKING</Badge>
          )}
        </div>
      </button>

      {expanded && hasDetails && (
        <div className="border-t border-border">
          <div className="divide-y divide-border/50">
            {changes.map((change, i) => (
              <div
                key={`${change.id}-${i}`}
                className={cn(
                  'flex items-start gap-3 px-4 py-2.5 pl-11',
                  change.level >= 3 && 'bg-destructive/5',
                )}
              >
                <ChangeIcon level={change.level} />
                <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                  {change.text}
                </p>
                {change.level >= 3 && (
                  <Badge variant="destructive" className="shrink-0 text-[10px]">
                    BREAKING
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeIcon({ level }: { level: number }) {
  if (level >= 3) {
    return <span className="mt-0.5 text-xs text-destructive">!</span>;
  }
  if (level >= 2) {
    return <span className="mt-0.5 text-xs text-warning">~</span>;
  }
  return <span className="mt-0.5 text-xs text-muted-foreground">&bull;</span>;
}
