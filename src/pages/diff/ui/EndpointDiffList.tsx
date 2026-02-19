import { Plus, Minus, Pencil } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { GroupDiff, ChangelogEntry } from '@/shared/types';

import { EndpointDiffCard } from './EndpointDiffCard';

type EndpointDiffListProps = {
  group: GroupDiff;
};

type EndpointGroup = {
  path: string;
  methods: string[];
  changes: ChangelogEntry[];
};

export function EndpointDiffList({ group }: EndpointDiffListProps) {
  const { diff, changelog } = group;
  const paths = diff.paths;

  const addedEndpoints = buildAddedEndpoints(paths?.added, changelog);
  const removedEndpoints = buildRemovedEndpoints(paths?.deleted, changelog);
  const modifiedEndpoints = buildModifiedEndpoints(paths?.modified, changelog);

  const hasContent =
    addedEndpoints.length > 0 ||
    removedEndpoints.length > 0 ||
    modifiedEndpoints.length > 0;

  if (!hasContent) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No endpoint changes in this version pair.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {addedEndpoints.length > 0 && (
        <EndpointSection
          icon={<Plus className="h-4 w-4" />}
          title="Added Endpoints"
          count={addedEndpoints.length}
          color="text-success"
        >
          {addedEndpoints.map((ep) => (
            <EndpointDiffCard
              key={ep.path}
              path={ep.path}
              methods={ep.methods}
              changeType="added"
              changes={ep.changes}
            />
          ))}
        </EndpointSection>
      )}

      {removedEndpoints.length > 0 && (
        <EndpointSection
          icon={<Minus className="h-4 w-4" />}
          title="Removed Endpoints"
          count={removedEndpoints.length}
          color="text-destructive"
        >
          {removedEndpoints.map((ep) => (
            <EndpointDiffCard
              key={ep.path}
              path={ep.path}
              methods={ep.methods}
              changeType="removed"
              changes={ep.changes}
            />
          ))}
        </EndpointSection>
      )}

      {modifiedEndpoints.length > 0 && (
        <EndpointSection
          icon={<Pencil className="h-4 w-4" />}
          title="Modified Endpoints"
          count={modifiedEndpoints.length}
          color="text-warning"
        >
          {modifiedEndpoints.map((ep) => (
            <EndpointDiffCard
              key={ep.path}
              path={ep.path}
              methods={ep.methods}
              changeType="modified"
              changes={ep.changes}
            />
          ))}
        </EndpointSection>
      )}
    </div>
  );
}

function EndpointSection({
  icon,
  title,
  count,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className={cn('mb-3 flex items-center gap-2', color)}>
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function buildAddedEndpoints(
  addedPaths: string[] | undefined,
  changelog: ChangelogEntry[],
): EndpointGroup[] {
  if (!addedPaths || addedPaths.length === 0) return [];

  const pathSet = new Set(addedPaths);
  const groups = new Map<string, EndpointGroup>();

  for (const entry of changelog) {
    if (!pathSet.has(entry.path)) continue;
    const existing = groups.get(entry.path);
    if (existing) {
      if (entry.operation && !existing.methods.includes(entry.operation)) {
        existing.methods.push(entry.operation);
      }
      existing.changes.push(entry);
    } else {
      groups.set(entry.path, {
        path: entry.path,
        methods: entry.operation ? [entry.operation] : [],
        changes: [entry],
      });
    }
  }

  // Add paths that have no changelog entries
  for (const path of addedPaths) {
    if (!groups.has(path)) {
      groups.set(path, { path, methods: [], changes: [] });
    }
  }

  return [...groups.values()];
}

function buildRemovedEndpoints(
  deletedPaths: string[] | undefined,
  changelog: ChangelogEntry[],
): EndpointGroup[] {
  if (!deletedPaths || deletedPaths.length === 0) return [];

  const pathSet = new Set(deletedPaths);
  const groups = new Map<string, EndpointGroup>();

  for (const entry of changelog) {
    if (!pathSet.has(entry.path)) continue;
    const existing = groups.get(entry.path);
    if (existing) {
      if (entry.operation && !existing.methods.includes(entry.operation)) {
        existing.methods.push(entry.operation);
      }
      existing.changes.push(entry);
    } else {
      groups.set(entry.path, {
        path: entry.path,
        methods: entry.operation ? [entry.operation] : [],
        changes: [entry],
      });
    }
  }

  for (const path of deletedPaths) {
    if (!groups.has(path)) {
      groups.set(path, { path, methods: [], changes: [] });
    }
  }

  return [...groups.values()];
}

function buildModifiedEndpoints(
  modifiedPaths: Record<string, unknown> | undefined,
  changelog: ChangelogEntry[],
): EndpointGroup[] {
  if (!modifiedPaths) return [];

  const pathKeys = Object.keys(modifiedPaths);
  if (pathKeys.length === 0) return [];

  const pathSet = new Set(pathKeys);
  const groups = new Map<string, EndpointGroup>();

  // Initialize from modified paths
  for (const path of pathKeys) {
    const pathDiff = modifiedPaths[path] as Record<string, unknown> | undefined;
    const ops = pathDiff?.operations as Record<string, unknown> | undefined;
    const modifiedOps = ops?.modified as Record<string, unknown> | undefined;
    const methods = modifiedOps ? Object.keys(modifiedOps) : [];
    groups.set(path, { path, methods, changes: [] });
  }

  // Attach changelog entries to their paths
  for (const entry of changelog) {
    if (!pathSet.has(entry.path)) continue;
    const group = groups.get(entry.path);
    if (group) {
      group.changes.push(entry);
      if (entry.operation && !group.methods.includes(entry.operation)) {
        group.methods.push(entry.operation);
      }
    }
  }

  return [...groups.values()];
}
