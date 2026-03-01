# Versioning Context

## Scope
Manages API version lifecycle — the manifest of all versions, per-version stats, and the list of available diff pairs.

## Aggregates
- **VersionManifest** (root) — contains all VersionEntry items
- **VersionEntry** — single version with stats and optional diff summary

## Key Files
| File | Role |
|------|------|
| `src/shared/types/version.ts` | Type definitions: VersionManifest, VersionEntry, VersionStats, DiffSummary |
| `src/shared/lib/api.ts` | `fetchVersions()` — fetches `/data/versions.json` |
| `src/shared/hooks/useVersions.ts` | React hook wrapping fetchVersions with AsyncState pattern |
| `scripts/generate-version-meta.mjs` | Build: extracts per-version stats from specs |
| `scripts/generate-versions-index.mjs` | Build: assembles manifest from individual meta files + diff summaries |

## Data Flow
```
specs/:version/*.json
  → generate-version-meta.mjs → public/data/meta/:version.json
  → generate-versions-index.mjs → public/data/versions.json
  → fetchVersions() → useVersions() → pages
```

## Invariants
- Versions are semver-sorted chronologically
- Every version has stats for both api and admin groups
- `availableDiffPairs` is the authoritative list of valid diff combinations
