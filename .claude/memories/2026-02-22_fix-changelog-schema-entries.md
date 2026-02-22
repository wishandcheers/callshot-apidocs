# Fix Changelog Crash on Schema-Level Entries

**Date**: 2026-02-22
**Type**: fix
**Commits**: c4bcbdf, 118d3bc

## Summary
Fixed runtime crash (`undefined.toUpperCase()`) when viewing v0.9.1 changelog, caused by oasdiff changelog entries that lack `operation`/`path` fields (schema-level changes like `api-schema-removed`).

## Root Cause
oasdiff `changelog` command produces two kinds of entries:
1. **Path-level**: has `operation`, `operationId`, `path`, `source`, `section`
2. **Schema-level**: has only `id`, `text`, `level`, `section` (e.g. `api-schema-removed`)

Previous versions had no schema-level changes, so the code assumed all fields existed. v0.9.1's major refactoring (photos → shutter, internal → admin) introduced many schema removals.

`ChangelogVersionEntry.tsx:ChangeEntryRow` passed `entry.operation` (undefined) directly to `<MethodBadge>`, which called `method.toUpperCase()`.

## Key Changes
- `ChangelogEntry`/`BreakingEntry` types: `operation`, `operationId`, `path`, `source` made optional
- `ChangeEntryRow`: conditional MethodBadge (only when operation exists), fallback to section Badge
- `EndpointDiffList`: added `!entry.path` guards in 3 changelog iteration loops
- Badge variant `"outline"` → `"muted"` (outline not in CVA variants)

## Decisions Made
- Optional fields on type (not separate union types): simpler, matches raw oasdiff JSON structure
- Show section name (COMPONENTS) as badge for schema entries: gives user context about change category
- Use `tsc -b` for CI validation: `tsc --noEmit` was less strict and missed these errors locally

## Files Affected
- `src/shared/types/changelog.ts` - optional fields on ChangelogEntry/BreakingEntry
- `src/pages/changelog/ui/ChangelogVersionEntry.tsx` - safe rendering of schema entries
- `src/pages/diff/ui/EndpointDiffList.tsx` - path guard in 3 loops

## Notes for Future
- Always validate with `npx tsc -b` before push (matches CI behavior), not just `tsc --noEmit`
- oasdiff breaking levels: 1=info, 2=warning, 3=error(breaking)
- Schema-level entries appear when schemas are added/removed/modified at the components level
- v0.9.1 has 17 breaking changes, all `api-path-removed-without-deprecation` from the photos→shutter and internal→admin refactoring
