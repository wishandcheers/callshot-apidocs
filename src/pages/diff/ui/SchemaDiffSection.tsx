import { useState } from 'react';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/atoms';

import type { RawDiff, SchemaModification } from '@/shared/types';

type SchemaDiffSectionProps = {
  diff: RawDiff;
};

export function SchemaDiffSection({ diff }: SchemaDiffSectionProps) {
  const schemas = diff.components?.schemas;
  if (!schemas) return null;

  const added = schemas.added ?? [];
  const deleted = schemas.deleted ?? [];
  const modified = schemas.modified ?? {};
  const modifiedKeys = Object.keys(modified);

  if (added.length === 0 && deleted.length === 0 && modifiedKeys.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Layers className="h-4 w-4" />
        <h3 className="text-sm font-semibold">Schema Changes</h3>
      </div>

      <div className="space-y-2">
        {added.length > 0 && (
          <SchemaList label="Added" items={added} variant="success" />
        )}
        {deleted.length > 0 && (
          <SchemaList label="Removed" items={deleted} variant="destructive" />
        )}
        {modifiedKeys.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-xs font-medium text-warning">
              Modified ({modifiedKeys.length})
            </p>
            <div className="space-y-1">
              {modifiedKeys.map((name) => (
                <SchemaModDetail
                  key={name}
                  name={name}
                  modification={modified[name] as SchemaModification}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SchemaList({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: 'success' | 'destructive';
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className={cn('mb-2 text-xs font-medium', variant === 'success' ? 'text-success' : 'text-destructive')}>
        {label} ({items.length})
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((name) => (
          <Badge key={name} variant={variant}>
            {name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

type ChangeEntry = {
  path: string;
  type: 'added' | 'deleted' | 'required-added' | 'required-deleted' | 'description' | 'modified';
};

function collectChanges(mod: SchemaModification, prefix: string): ChangeEntry[] {
  const entries: ChangeEntry[] = [];

  const addedProps = mod.properties?.added ?? [];
  const deletedProps = mod.properties?.deleted ?? [];
  const addedRequired = mod.required?.added ?? [];
  const deletedRequired = mod.required?.deleted ?? [];

  for (const p of addedProps) {
    entries.push({ path: prefix ? `${prefix}.${p}` : p, type: 'added' });
  }
  for (const p of deletedProps) {
    entries.push({ path: prefix ? `${prefix}.${p}` : p, type: 'deleted' });
  }
  for (const r of addedRequired) {
    entries.push({ path: prefix ? `${prefix}.${r}` : r, type: 'required-added' });
  }
  for (const r of deletedRequired) {
    entries.push({ path: prefix ? `${prefix}.${r}` : r, type: 'required-deleted' });
  }
  if (mod.description) {
    entries.push({ path: prefix || '(root)', type: 'description' });
  }

  // Recurse into modified properties
  const modifiedProps = mod.properties?.modified;
  if (modifiedProps) {
    for (const [propName, propMod] of Object.entries(modifiedProps)) {
      const childPrefix = prefix ? `${prefix}.${propName}` : propName;
      const childEntries = collectChanges(propMod, childPrefix);
      if (childEntries.length > 0) {
        entries.push(...childEntries);
      } else {
        // Property is marked modified but has no extractable detail
        entries.push({ path: childPrefix, type: 'modified' });
      }
    }
  }

  // Recurse into items (array schema)
  if (mod.items) {
    const itemsPrefix = prefix ? `${prefix}[]` : '[]';
    const itemEntries = collectChanges(mod.items, itemsPrefix);
    entries.push(...itemEntries);
  }

  return entries;
}

function SchemaModDetail({
  name,
  modification,
}: {
  name: string;
  modification: SchemaModification;
}) {
  const [expanded, setExpanded] = useState(false);
  const changes = collectChanges(modification, '');
  const hasChanges = changes.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChanges && setExpanded(!expanded)}
        className={cn(
          'flex items-center gap-1.5 text-left',
          hasChanges && 'cursor-pointer hover:bg-muted/30 -mx-1 px-1 rounded',
          !hasChanges && 'cursor-default',
        )}
      >
        {hasChanges && (
          expanded
            ? <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
            : <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        )}
        <span className="font-mono text-xs text-foreground">{name}</span>
        {hasChanges && (
          <span className="text-xs text-muted-foreground">
            ({changes.length} {changes.length === 1 ? 'change' : 'changes'})
          </span>
        )}
      </button>

      {expanded && hasChanges && (
        <div className="mt-1 space-y-0.5 pl-5">
          {changes.map((entry, i) => (
            <ChangeEntryLine key={`${entry.path}-${entry.type}-${i}`} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChangeEntryLine({ entry }: { entry: ChangeEntry }) {
  switch (entry.type) {
    case 'added':
      return (
        <p className="font-mono text-xs text-success">
          + {entry.path}
        </p>
      );
    case 'deleted':
      return (
        <p className="font-mono text-xs text-destructive">
          - {entry.path}
        </p>
      );
    case 'required-added':
      return (
        <p className="font-mono text-xs text-success">
          + required: {entry.path}
        </p>
      );
    case 'required-deleted':
      return (
        <p className="font-mono text-xs text-destructive">
          - required: {entry.path}
        </p>
      );
    case 'description':
      return (
        <p className="font-mono text-xs text-muted-foreground">
          ~ description changed: {entry.path}
        </p>
      );
    case 'modified':
      return (
        <p className="font-mono text-xs text-warning">
          ~ {entry.path} modified
        </p>
      );
  }
}
