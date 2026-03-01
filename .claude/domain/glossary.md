# Domain Glossary

> Ubiquitous language dictionary. Generated/maintained by `/domain scan`.

| Term | Definition | Context | Code Reference |
|------|-----------|---------|----------------|
| Version | A tagged release of the API spec (e.g., v0.9.1) | versioning | `src/shared/types/version.ts` |
| Version Manifest | Root JSON containing all versions, service name, and available diff pairs | versioning | `VersionManifest` in `version.ts` |
| Version Entry | Single version record with stats and optional diff summary | versioning | `VersionEntry` in `version.ts` |
| Spec Group | One of two API spec partitions: `api` (public) or `admin` (internal) | documentation | `SPEC_GROUPS` in `generate-diffs.mjs` |
| Diff Data | Full structural diff between two versions, split by spec group | comparison | `DiffData` in `diff.ts` |
| Group Diff | Per-group diff containing raw diff, changelog, breaking entries, and summary | comparison | `GroupDiff` in `diff.ts` |
| Raw Diff | Structural diff output from oasdiff — paths added/removed/modified, schema changes | comparison | `RawDiff` in `diff.ts` |
| Changelog Entry | Single human-readable change item with operation, path, level, section | comparison | `ChangelogEntry` in `changelog.ts` |
| Breaking Entry | Changelog entry representing a breaking API change | comparison | `BreakingEntry` in `changelog.ts` |
| Diff Summary | Counts of added, removed, modified, and breaking changes | comparison | `DiffSummary` in `version.ts` |
| Diff Pair | A from/to version combination for which diffs are pre-computed | comparison | `availableDiffPairs` in `VersionManifest` |
| Window Size | Number of previous versions each version is diffed against (default: 3) | comparison | `WINDOW_SIZE` in `generate-diffs.mjs` |
| oasdiff | External CLI tool that computes OpenAPI spec diffs, changelogs, and breaking changes | comparison | `scripts/generate-diffs.mjs` |
| Redoc | OpenAPI documentation renderer used for the API reference page | documentation | `pages/reference/ui/ApiReferencePage.tsx` |
| Spec Type | Either `api` or `admin` — selects which OpenAPI spec file to render/diff | documentation | `SpecType` in `SpecTypeTabs.tsx` |
| Static Data Pipeline | Build-time process that generates all JSON data from raw specs | build | `scripts/` directory |
