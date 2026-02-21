# Rename Internal Group to Admin

**Date**: 2026-02-22
**Type**: refactor
**Commit**: fad5654

## Summary
Renamed the "internal" OpenAPI group to "admin" across the entire apidocs project to align with backend refactoring that merged the `internal/` module into `auth/` domain.

## Key Changes
- Spec files: `apiDocs-internal.json` → `apiDocs-admin.json` (10 versions, git detected as clean renames)
- Scripts: SPEC_GROUPS/SPEC_FILES updated, all `internal*` variables renamed to `admin*`
- Types: `VersionStats.internal` → `.admin`, `DiffData.groups.internal` → `.admin`, `ChangelogData`/`BreakingData` likewise
- UI: "Internal" tab label → "Admin" in SpecTypeTabs, GroupTabs, DiffPage, ApiReferencePage, ChangelogVersionEntry

## Decisions Made
- Rename old spec files (not just new ones): keeps codebase clean, eliminates all `internal` references. User chose this over "keep both, map in scripts"
- v0.9.1 NOT added yet: user confirmed it's still unreleased despite the backend refactoring being done
- UI label "Admin": matches the new backend OpenAPI group name

## Files Affected
- `specs/v*/apiDocs-internal.json` → `apiDocs-admin.json` (10 versions)
- `scripts/generate-diffs.mjs` - SPEC_GROUPS update
- `scripts/generate-version-meta.mjs` - variable renames + group key
- `scripts/copy-specs-to-public.mjs` - SPEC_FILES update
- `src/shared/types/version.ts` - VersionStats.admin
- `src/shared/types/diff.ts` - DiffData.groups.admin
- `src/shared/types/changelog.ts` - ChangelogData/BreakingData.groups.admin
- `src/pages/reference/ui/SpecTypeTabs.tsx` - SpecType union + label
- `src/pages/reference/ui/ApiReferencePage.tsx` - spec filename
- `src/pages/diff/ui/GroupTabs.tsx` - DiffGroup union + props + label
- `src/pages/diff/ui/DiffPage.tsx` - adminChanges variable
- `src/pages/changelog/ui/ChangelogVersionEntry.tsx` - groups.admin

## Notes for Future
- When v0.9.1 is released, add `specs/v0.9.1/` with `apiDocs-api.json`, `apiDocs-admin.json`, `apiDocs-all.yaml` from `callshot/api/build/docs/`
- Backend context: `/internal/admin/users` → `/api/admin/users`, OpenAPI group `internal` → `admin`, tag `@Tag(name = "Admin")`
- See callshot memory: `.claude/memories/2026-02-22_merge-internal-admin-into-auth.md`
