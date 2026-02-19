import { useState } from 'react';

import { useVersions } from '@/shared/hooks';

import { ChangelogFilters, type ChangeFilter } from './ChangelogFilters';
import { ChangelogVersionEntry } from './ChangelogVersionEntry';

export function ChangelogPage() {
  const state = useVersions();
  const [filter, setFilter] = useState<ChangeFilter>('all');

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load version data: {state.error.message}
      </div>
    );
  }

  const versionsWithDiffs = state.data.versions.filter((v) => v.diff !== null);
  const reversed = [...versionsWithDiffs].reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {versionsWithDiffs.length} version updates
        </p>
        <ChangelogFilters active={filter} onChange={setFilter} />
      </div>

      <div className="space-y-3">
        {reversed.map((version) => (
          <ChangelogVersionEntry
            key={version.version}
            version={version}
            filter={filter}
          />
        ))}
      </div>
    </div>
  );
}
