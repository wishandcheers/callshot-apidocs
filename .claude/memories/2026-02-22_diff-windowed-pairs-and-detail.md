# Windowed Diff Pairs and Detailed Change Display

**Date**: 2026-02-22
**Type**: feat
**Commits**: 1990926, 208ec38

## Summary
Expanded diff generation from consecutive-only to sliding window (N=3), improved schema and endpoint diff detail display, removed unreleased v0.9.1, and replaced legacy duckdns.org domains across all specs.

## Key Changes
- `generate-diffs.mjs`: sliding window (WINDOW_SIZE=3) generates ~24 pairs instead of ~10
- `generate-versions-index.mjs`: adds `availableDiffPairs` to versions.json manifest
- `VersionPicker`: filters dropdown options to only available diff pairs
- `SchemaDiffSection`: recursive `collectChanges()` traverses nested `properties.modified` and `items` — eliminates "(internal changes)" label
- `EndpointDiffList`: `extractChangesFromDiff()` parses `PathDiff`/`OperationDiff` directly when changelog entries are missing
- All specs: duckdns.org domains replaced with call-shot.com

## Decisions Made
- Window size 3: balances coverage (~27 pairs) vs file count; user chose over all-pairs (55) and window-5 (40)
- Changelog kept consecutive-only: user decided changelog doesn't need arbitrary pair support
- Diff-extracted changes as synthetic ChangelogEntry: reuses existing EndpointDiffCard without new component types
- Schema changes collapsible: each schema has click-to-expand with change count badge

## Files Affected
- `scripts/generate-diffs.mjs` - sliding window loop
- `scripts/generate-versions-index.mjs` - availableDiffPairs scan
- `src/shared/types/version.ts` - VersionManifest type update
- `src/pages/diff/ui/VersionPicker.tsx` - pair-aware filtering
- `src/pages/diff/ui/DiffPage.tsx` - passes availableDiffPairs prop
- `src/pages/diff/ui/SchemaDiffSection.tsx` - recursive deep diff display
- `src/pages/diff/ui/EndpointDiffList.tsx` - diff structure extraction
- `specs/v0.2.1–v0.9.0/` - domain replacement (30 files)

## Notes for Future
- oasdiff changelog misses description-only changes and deep nested modifications — the diff structure extraction fills this gap
- v0.9.1 was removed because it's unreleased; re-add specs/v0.9.1/ when ready
- `public/data/` is fully regenerated from `specs/` — clean with `rm -rf public/data/{meta,diffs,changelogs,breaking,specs,versions.json}` then `pnpm generate`
- Domain mapping: dev-api.call-shot.com (server), dev-cdn.call-shot.com (CDN)
