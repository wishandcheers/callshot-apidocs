import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useVersions, useDiff } from '@/shared/hooks';

import { VersionPicker } from './VersionPicker';
import { BreakingChangeAlert } from './BreakingChangeAlert';
import { DiffSummaryBar } from './DiffSummaryBar';
import { GroupTabs, type DiffGroup } from './GroupTabs';
import { EndpointDiffList } from './EndpointDiffList';
import { SchemaDiffSection } from './SchemaDiffSection';

export function DiffPage() {
  const { from, to } = useParams<{ from: string; to: string }>();
  const navigate = useNavigate();
  const versionsState = useVersions();
  const diffState = useDiff(from ?? null, to ?? null);
  const [activeGroup, setActiveGroup] = useState<DiffGroup>('api');

  // Auto-redirect to latest consecutive pair when no params
  useEffect(() => {
    if (from || to) return;
    if (versionsState.status !== 'success') return;

    const versions = versionsState.data.versions;
    if (versions.length < 2) return;

    const latest = versions[versions.length - 1];
    const previous = versions[versions.length - 2];
    if (latest && previous) {
      void navigate(`/diff/${previous.version}/${latest.version}`, { replace: true });
    }
  }, [from, to, versionsState, navigate]);

  if (versionsState.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (versionsState.status === 'error') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load version data: {versionsState.error.message}
      </div>
    );
  }

  const { versions, availableDiffPairs } = versionsState.data;

  return (
    <div className="space-y-4">
      <VersionPicker versions={versions} from={from ?? null} to={to ?? null} availableDiffPairs={availableDiffPairs} />

      {!from || !to ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Select two versions to compare.
        </p>
      ) : (
        <DiffContent
          diffState={diffState}
          activeGroup={activeGroup}
          onGroupChange={setActiveGroup}
        />
      )}
    </div>
  );
}

function DiffContent({
  diffState,
  activeGroup,
  onGroupChange,
}: {
  diffState: ReturnType<typeof useDiff>;
  activeGroup: DiffGroup;
  onGroupChange: (g: DiffGroup) => void;
}) {
  if (diffState.status === 'loading' || diffState.status === 'idle') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (diffState.status === 'error') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        No diff data available for this version pair.
      </div>
    );
  }

  const { data } = diffState;
  const group = data.groups[activeGroup];
  const apiChanges = totalChanges(data.groups.api.summary);
  const adminChanges = totalChanges(data.groups.admin.summary);

  return (
    <div className="space-y-4">
      <BreakingChangeAlert count={group.summary.breaking} />
      <DiffSummaryBar summary={group.summary} />

      <GroupTabs
        active={activeGroup}
        onChange={onGroupChange}
        apiCount={apiChanges}
        adminCount={adminChanges}
      />

      <EndpointDiffList group={group} />
      <SchemaDiffSection diff={group.diff} />
    </div>
  );
}

function totalChanges(summary: { added: number; removed: number; modified: number }): number {
  return summary.added + summary.removed + summary.modified;
}
