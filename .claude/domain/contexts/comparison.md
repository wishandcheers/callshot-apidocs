# Comparison Context

## Scope
Handles diff computation between API versions — structural diffs, human-readable changelogs, and breaking change detection. All data is pre-computed at build time.

## Aggregates
- **DiffData** (root) — full diff between two versions with per-group data
- **GroupDiff** — per-group (api/admin) raw diff + changelog + breaking
- **ChangelogEntry** — individual change item

## Key Files
| File | Role |
|------|------|
| `src/shared/types/diff.ts` | Types: DiffData, GroupDiff, RawDiff, PathDiff, OperationDiff, SchemaModification |
| `src/shared/types/changelog.ts` | Types: ChangelogEntry, ChangelogData, BreakingEntry, BreakingData |
| `src/shared/lib/api.ts` | `fetchDiff()`, `fetchChangelog()`, `fetchBreaking()` |
| `src/shared/hooks/useDiff.ts` | React hook for DiffData with idle/loading/success/error states |
| `src/shared/hooks/useChangelog.ts` | React hook for ChangelogData |
| `scripts/generate-diffs.mjs` | Build: runs oasdiff for each version pair → generates all diff/changelog/breaking JSON |

## Data Flow
```
specs/:from/*.json + specs/:to/*.json
  → oasdiff diff/changelog/breaking
  → generate-diffs.mjs
  → public/data/diffs/{from}_{to}.json
  → public/data/changelogs/{from}_{to}.json
  → public/data/breaking/{from}_{to}.json
  → fetchDiff/fetchChangelog/fetchBreaking → hooks → pages
```

## Windowed Diff Strategy
- `WINDOW_SIZE = 3`: each version is compared against up to 3 previous versions
- For 11 versions, this produces ~28 diff pairs (not all N*(N-1)/2 = 55)
- Valid pairs stored in `VersionManifest.availableDiffPairs`

## Invariants
- Every DiffData has exactly two groups: `api` and `admin`
- Breaking entries are always a subset of changelog entries
- Schema-level ChangelogEntries may omit `operation` and `path` fields
