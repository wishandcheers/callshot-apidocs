# Changelog Entry

**Context**: comparison | **Type**: value-object

## Definition
Single human-readable change item produced by oasdiff, describing what changed between two API versions.

## Type
```typescript
// src/shared/types/changelog.ts
type ChangelogEntry = {
  id: string;
  text: string;           // Human-readable description
  level: number;          // Severity level (used for breaking detection)
  operation?: string;     // HTTP method (optional — omitted for schema-level)
  operationId?: string;
  path?: string;          // API path (optional — omitted for schema-level)
  source?: string;
  section: string;        // Category of change
};
```

## Also Used As
`BreakingEntry` has identical shape (separate type alias for clarity):
```typescript
type BreakingData = {
  fromVersion: string;
  toVersion: string;
  groups: { api: BreakingEntry[]; admin: BreakingEntry[] };
};
```

## UI Components
- `ChangelogVersionEntry` — renders entries for a version pair with filter support
- `BreakingChangeAlert` — shows alert banner when breaking count > 0
- `EndpointDiffCard` — renders individual endpoint changes with method badges

## Business Rules
- `operation` is optional: schema-level changes (added/removed/modified schemas) have no HTTP method
- `section` categorizes the change type (used for filtering in changelog page)
- Breaking entries are a strict subset of changelog entries
