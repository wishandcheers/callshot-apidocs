import { Layers } from 'lucide-react';

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
            <div className="space-y-3">
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

function SchemaModDetail({
  name,
  modification,
}: {
  name: string;
  modification: SchemaModification;
}) {
  const addedProps = modification.properties?.added ?? [];
  const deletedProps = modification.properties?.deleted ?? [];
  const addedRequired = modification.required?.added ?? [];
  const deletedRequired = modification.required?.deleted ?? [];
  const descChange = modification.description;

  const hasChanges =
    addedProps.length > 0 ||
    deletedProps.length > 0 ||
    addedRequired.length > 0 ||
    deletedRequired.length > 0 ||
    descChange;

  if (!hasChanges) {
    return (
      <div>
        <span className="font-mono text-xs text-foreground">{name}</span>
        <span className="ml-2 text-xs text-muted-foreground">(internal changes)</span>
      </div>
    );
  }

  return (
    <div>
      <span className="font-mono text-xs font-medium text-foreground">{name}</span>
      <div className="mt-1 space-y-0.5 pl-3">
        {addedProps.map((p) => (
          <p key={`add-${p}`} className="font-mono text-xs text-success">
            + {p}
          </p>
        ))}
        {deletedProps.map((p) => (
          <p key={`del-${p}`} className="font-mono text-xs text-destructive">
            - {p}
          </p>
        ))}
        {addedRequired.map((r) => (
          <p key={`req-add-${r}`} className="font-mono text-xs text-success">
            + required: {r}
          </p>
        ))}
        {deletedRequired.map((r) => (
          <p key={`req-del-${r}`} className="font-mono text-xs text-destructive">
            - required: {r}
          </p>
        ))}
        {descChange && (
          <p className="text-xs text-muted-foreground">
            description changed
          </p>
        )}
      </div>
    </div>
  );
}
