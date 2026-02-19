import { Link } from 'react-router-dom';

import { cn } from '@/shared/lib/cn';
import { formatDate } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/atoms';

import type { VersionEntry } from '@/shared/types';

type VersionTimelineProps = {
  versions: VersionEntry[];
};

export function VersionTimeline({ versions }: VersionTimelineProps) {
  const reversed = [...versions].reverse();

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Version Timeline
        </h2>
      </div>
      <div className="divide-y divide-border">
        {reversed.map((version, index) => (
          <TimelineItem
            key={version.version}
            version={version}
            isLatest={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  version,
  isLatest,
}: {
  version: VersionEntry;
  isLatest: boolean;
}) {
  const { diff } = version;

  return (
    <div className="flex items-center gap-4 px-5 py-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            isLatest ? 'bg-primary' : 'bg-muted-foreground/40',
          )}
        />
        <span
          className={cn(
            'w-16 font-mono text-sm font-semibold',
            isLatest ? 'text-primary' : 'text-foreground',
          )}
        >
          {version.version}
        </span>
      </div>

      <span className="w-28 text-xs text-muted-foreground">
        {formatDate(version.releasedAt)}
      </span>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {version.stats.api.endpointCount} endpoints
        </span>
      </div>

      {diff ? (
        <div className="flex flex-1 items-center justify-end gap-2">
          {diff.summary.added > 0 && (
            <Badge variant="success">+{diff.summary.added}</Badge>
          )}
          {diff.summary.removed > 0 && (
            <Badge variant="destructive">-{diff.summary.removed}</Badge>
          )}
          {diff.summary.modified > 0 && (
            <Badge variant="warning">{diff.summary.modified} mod</Badge>
          )}
          {diff.summary.breaking > 0 && (
            <Badge variant="destructive">
              {diff.summary.breaking} breaking
            </Badge>
          )}
          <Link
            to={`/diff/${diff.previousVersion}/${version.version}`}
            className="ml-2 text-xs text-primary hover:underline"
          >
            View diff
          </Link>
        </div>
      ) : (
        <div className="flex flex-1 justify-end">
          <Badge variant="muted">Initial</Badge>
        </div>
      )}
    </div>
  );
}
