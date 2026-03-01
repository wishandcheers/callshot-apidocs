# Build Pipeline Workflow

## Description
Build-time process that transforms raw OpenAPI specs into static JSON data consumed by the frontend.

## Flow
```
1. Raw specs placed in specs/:version/ (manual or CI)
2. pnpm generate runs all generators:
   a. copy-specs-to-public.mjs → public/data/specs/:version/
   b. generate-version-meta.mjs → public/data/meta/:version.json
   c. generate-diffs.mjs → public/data/diffs/, changelogs/, breaking/
   d. generate-versions-index.mjs → public/data/versions.json
3. pnpm build runs: generate + tsc-b + vite build
```

## Scripts
| Script | Input | Output | Tool |
|--------|-------|--------|------|
| `copy-specs-to-public.mjs` | `specs/:version/*.json` | `public/data/specs/:version/` | fs copy |
| `generate-version-meta.mjs` | `specs/:version/*.json` | `public/data/meta/:version.json` | JSON parse |
| `generate-diffs.mjs` | `specs/:from/*.json`, `specs/:to/*.json` | `public/data/diffs/`, `changelogs/`, `breaking/` | oasdiff CLI |
| `generate-versions-index.mjs` | `public/data/meta/*.json`, `public/data/diffs/*.json` | `public/data/versions.json` | JSON assembly |

## Dependencies
- **oasdiff**: Must be installed and on PATH for diff generation
- **Node.js**: All scripts are ESM (.mjs)

## Key Details
- Windowed diffs: WINDOW_SIZE=3 limits diff pair count for performance
- oasdiff exit codes: non-zero for breaking changes (handled gracefully)
- Spec groups: each version has `apiDocs-api.json` and `apiDocs-admin.json`
- Generated data goes to `public/data/` which is gitignored (regenerated on build)
