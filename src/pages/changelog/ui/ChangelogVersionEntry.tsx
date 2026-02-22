import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { formatDate } from '@/shared/lib/format';
import { Badge, MethodBadge } from '@/shared/ui/atoms';
import { useChangelog } from '@/shared/hooks';

import type { VersionEntry, ChangelogEntry } from '@/shared/types';
import type { ChangeFilter } from './ChangelogFilters';

type ChangelogVersionEntryProps = {
  version: VersionEntry;
  filter: ChangeFilter;
};

export function ChangelogVersionEntry({ version, filter }: ChangelogVersionEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const { diff } = version;
  if (!diff) return null;

  const matchesFilter =
    filter === 'all' ||
    (filter === 'breaking' && diff.summary.breaking > 0) ||
    (filter === 'added' && diff.summary.added > 0) ||
    (filter === 'removed' && diff.summary.removed > 0) ||
    (filter === 'modified' && diff.summary.modified > 0);

  if (!matchesFilter) return null;

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/30"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}

        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-foreground">
            {version.version}
          </span>
          <span className="text-xs text-muted-foreground">
            from {diff.previousVersion}
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          {formatDate(version.releasedAt)}
        </span>

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
        </div>
      </button>

      {expanded && (
        <ExpandedChanges
          from={diff.previousVersion}
          to={version.version}
          filter={filter}
        />
      )}
    </div>
  );
}

function ExpandedChanges({
  from,
  to,
  filter,
}: {
  from: string;
  to: string;
  filter: ChangeFilter;
}) {
  const state = useChangelog(from, to);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="flex items-center justify-center border-t border-border py-6">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="border-t border-border px-5 py-4 text-xs text-destructive">
        Failed to load: {state.error.message}
      </div>
    );
  }

  const { data } = state;
  const allEntries = [...data.groups.api, ...data.groups.admin];
  const filtered = filterEntries(allEntries, filter);

  if (filtered.length === 0) {
    return (
      <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
        No changes match the current filter.
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      <div className="divide-y divide-border/50">
        {filtered.map((entry, i) => (
          <ChangeEntryRow key={`${entry.path}-${entry.operation}-${entry.id}-${i}`} entry={entry} />
        ))}
      </div>
      <div className="border-t border-border px-5 py-3">
        <Link
          to={`/diff/${from}/${to}`}
          className="text-xs text-primary hover:underline"
        >
          View full diff
        </Link>
      </div>
    </div>
  );
}

function ChangeEntryRow({ entry }: { entry: ChangelogEntry }) {
  const isBreaking = entry.level >= 3;

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-5 py-2.5',
        isBreaking && 'bg-destructive/5',
      )}
    >
      {entry.operation ? (
        <MethodBadge method={entry.operation} />
      ) : (
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {entry.section?.toUpperCase() ?? 'SCHEMA'}
        </Badge>
      )}
      <div className="min-w-0 flex-1">
        {entry.path && (
          <p className="font-mono text-xs text-foreground">{entry.path}</p>
        )}
        <p className={cn('text-xs text-muted-foreground', entry.path && 'mt-0.5')}>
          {entry.text}
        </p>
      </div>
      {isBreaking && (
        <Badge variant="destructive" className="shrink-0">
          BREAKING
        </Badge>
      )}
    </div>
  );
}

function filterEntries(
  entries: ChangelogEntry[],
  filter: ChangeFilter,
): ChangelogEntry[] {
  if (filter === 'all') return entries;
  if (filter === 'breaking') return entries.filter((e) => e.level >= 3);
  if (filter === 'added') return entries.filter((e) => e.id.includes('added'));
  if (filter === 'removed') return entries.filter((e) => e.id.includes('removed'));
  if (filter === 'modified') {
    return entries.filter(
      (e) =>
        !e.id.includes('added') &&
        !e.id.includes('removed') &&
        e.level < 3,
    );
  }
  return entries;
}
