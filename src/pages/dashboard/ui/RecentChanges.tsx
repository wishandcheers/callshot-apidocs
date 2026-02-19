import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/shared/ui/atoms';
import { formatDate } from '@/shared/lib/format';

import type { VersionEntry } from '@/shared/types';

type RecentChangesProps = {
  versions: VersionEntry[];
};

export function RecentChanges({ versions }: RecentChangesProps) {
  const recent = [...versions]
    .filter((v) => v.diff !== null)
    .reverse()
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Recent Changes
        </h2>
        <Link
          to="/changelog"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {recent.map((version) => (
          <RecentItem key={version.version} version={version} />
        ))}
      </div>
    </div>
  );
}

function RecentItem({ version }: { version: VersionEntry }) {
  const { diff } = version;
  if (!diff) return null;

  const total =
    diff.summary.added +
    diff.summary.removed +
    diff.summary.modified;

  return (
    <Link
      to={`/diff/${diff.previousVersion}/${version.version}`}
      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/30"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">
            {diff.previousVersion}
          </span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm font-semibold text-primary">
            {version.version}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDate(version.releasedAt)} &middot; {total} change{total !== 1 ? 's' : ''}
        </p>
      </div>
      {diff.summary.breaking > 0 && (
        <Badge variant="destructive">{diff.summary.breaking} breaking</Badge>
      )}
    </Link>
  );
}
