# Version Comparison Workflow

## Description
User selects two API versions to compare, views per-group structural diffs, changelog entries, and breaking changes.

## Flow
```
1. User navigates to /diff (or /diff/:from/:to)
2. useVersions() loads VersionManifest
3. If no URL params → auto-redirect to latest consecutive pair
4. VersionPicker renders version selectors (constrained by availableDiffPairs)
5. User selects from/to versions
6. useDiff(from, to) fetches DiffData from /data/diffs/{from}_{to}.json
7. GroupTabs show api/admin with per-group change counts
8. DiffContent renders:
   - BreakingChangeAlert (if breaking > 0)
   - DiffSummaryBar (added/removed/modified/breaking counts)
   - EndpointDiffList (path-level changes with operation details)
   - SchemaDiffSection (schema-level changes)
```

## Components
| Component | File | Role |
|-----------|------|------|
| DiffPage | `pages/diff/ui/DiffPage.tsx` | Page orchestrator |
| VersionPicker | `pages/diff/ui/VersionPicker.tsx` | From/to version selectors |
| GroupTabs | `pages/diff/ui/GroupTabs.tsx` | Api/admin tab switcher |
| DiffSummaryBar | `pages/diff/ui/DiffSummaryBar.tsx` | Change count summary |
| BreakingChangeAlert | `pages/diff/ui/BreakingChangeAlert.tsx` | Breaking change banner |
| EndpointDiffList | `pages/diff/ui/EndpointDiffList.tsx` | Path-level diff cards |
| SchemaDiffSection | `pages/diff/ui/SchemaDiffSection.tsx` | Schema change display |

## Routes
- `/diff` — auto-redirects to latest pair
- `/diff/:from/:to` — specific version comparison
