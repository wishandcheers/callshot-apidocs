import { useVersions } from '@/shared/hooks';

import { StatsCards } from './StatsCards';
import { VersionTimeline } from './VersionTimeline';
import { RecentChanges } from './RecentChanges';

export function DashboardPage() {
  const state = useVersions();

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

  const { data } = state;

  return (
    <div className="space-y-6">
      <StatsCards data={data} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <VersionTimeline versions={data.versions} />
        </div>
        <div className="lg:col-span-2">
          <RecentChanges versions={data.versions} />
        </div>
      </div>
    </div>
  );
}
