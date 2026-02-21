import { Plus, Minus, Pencil } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { GroupDiff, ChangelogEntry, PathDiff, OperationDiff } from '@/shared/types';

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
  modifiedPaths: Record<string, PathDiff> | undefined,
  changelog: ChangelogEntry[],
): EndpointGroup[] {
  if (!modifiedPaths) return [];

  const pathKeys = Object.keys(modifiedPaths);
  if (pathKeys.length === 0) return [];

  const pathSet = new Set(pathKeys);
  const groups = new Map<string, EndpointGroup>();

  // Initialize from modified paths
  for (const path of pathKeys) {
    const pathDiff = modifiedPaths[path];
    const modifiedOps = pathDiff?.operations?.modified;
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

  // For endpoints with no changelog entries, extract from diff structure
  for (const [path, group] of groups) {
    if (group.changes.length > 0) continue;

    const pathDiff = modifiedPaths[path];
    if (!pathDiff) continue;
    const extracted = extractChangesFromDiff(path, pathDiff);
    group.changes.push(...extracted);
  }

  return [...groups.values()];
}

function extractChangesFromDiff(path: string, pathDiff: PathDiff): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];

  const ops = pathDiff?.operations;
  if (!ops) return entries;

  // Added operations
  for (const method of ops.added ?? []) {
    entries.push(makeSyntheticEntry(path, method, `${method} operation added`, 1));
  }

  // Deleted operations
  for (const method of ops.deleted ?? []) {
    entries.push(makeSyntheticEntry(path, method, `${method} operation removed`, 2));
  }

  // Modified operations
  const modified = ops.modified;
  if (modified) {
    for (const [method, opDiff] of Object.entries(modified)) {
      entries.push(...extractOpChanges(path, method, opDiff));
    }
  }

  return entries;
}

function extractOpChanges(path: string, method: string, opDiff: OperationDiff): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];

  if (opDiff.summary) {
    entries.push(makeSyntheticEntry(
      path, method,
      `summary changed: "${opDiff.summary.from}" → "${opDiff.summary.to}"`,
      1,
    ));
  }

  if (opDiff.description) {
    const fromSnippet = opDiff.description.from?.slice(0, 50) || '(empty)';
    const toSnippet = opDiff.description.to?.slice(0, 50) || '(empty)';
    entries.push(makeSyntheticEntry(
      path, method,
      `description changed: "${fromSnippet}" → "${toSnippet}"`,
      1,
    ));
  }

  if (opDiff.operationID) {
    entries.push(makeSyntheticEntry(
      path, method,
      `operationId changed: ${opDiff.operationID.from} → ${opDiff.operationID.to}`,
      1,
    ));
  }

  if (opDiff.tags) {
    for (const tag of opDiff.tags.added ?? []) {
      entries.push(makeSyntheticEntry(path, method, `tag added: ${tag}`, 1));
    }
    for (const tag of opDiff.tags.deleted ?? []) {
      entries.push(makeSyntheticEntry(path, method, `tag removed: ${tag}`, 1));
    }
  }

  if (opDiff.parameters?.modified) {
    const paramCount = Object.keys(opDiff.parameters.modified).length;
    entries.push(makeSyntheticEntry(
      path, method,
      `${paramCount} parameter(s) modified`,
      1,
    ));
  }

  if (opDiff.requestBody) {
    entries.push(makeSyntheticEntry(path, method, 'request body modified', 1));
  }

  if (opDiff.responses?.modified) {
    const statusCodes = Object.keys(opDiff.responses.modified);
    entries.push(makeSyntheticEntry(
      path, method,
      `response modified: ${statusCodes.join(', ')}`,
      1,
    ));
  }

  // If we found modified operations but couldn't extract specific changes,
  // add a generic entry so the card isn't empty
  if (entries.length === 0) {
    entries.push(makeSyntheticEntry(path, method, 'endpoint modified (structural changes)', 1));
  }

  return entries;
}

function makeSyntheticEntry(
  path: string,
  operation: string,
  text: string,
  level: number,
): ChangelogEntry {
  return {
    id: 'diff-extracted',
    text,
    level,
    operation,
    operationId: '',
    path,
    source: '',
    section: 'paths',
  };
}
