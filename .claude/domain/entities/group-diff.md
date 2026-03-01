# Group Diff

**Context**: comparison | **Type**: value-object

## Definition
Per-group diff result containing the raw structural diff, changelog entries, breaking entries, and summary counts.

## Type
```typescript
// src/shared/types/diff.ts
type GroupDiff = {
  diff: RawDiff;
  changelog: ChangelogEntry[];
  breaking: ChangelogEntry[];
  summary: DiffSummary;  // { added, removed, modified, breaking }
};

type RawDiff = {
  info?: { title?: StringChange; description?: StringChange; version?: StringChange };
  servers?: AddedDeleted;
  tags?: AddedDeleted;
  paths?: {
    added?: string[];
    deleted?: string[];
    modified?: Record<string, PathDiff>;
  };
  components?: {
    schemas?: {
      added?: string[];
      deleted?: string[];
      modified?: Record<string, SchemaModification>;
    };
  };
};
```

## UI Components
- `DiffSummaryBar` — shows added/removed/modified/breaking counts
- `EndpointDiffList` — renders path-level changes with operation details
- `SchemaDiffSection` — renders schema-level changes
- `GroupTabs` — switches between api/admin groups with change counts

## Business Rules
- `summary.breaking` count comes from `breaking.length`
- `summary.added/removed/modified` are path-level counts from `diff.paths`
- Tab UI shows total changes (added + removed + modified) per group
