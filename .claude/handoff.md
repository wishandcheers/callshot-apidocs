# Session Handoff
**Date**: 2026-02-19
**Branch**: master
**Status**: Clean (only this handoff.md uncommitted)

## Goal
Implement the CallShot API Changelog project from PLAN.md — an interactive SPA for viewing API version diffs.

## Completed
- Phase 1 (commit `32f4322`):
  - Vite 6 + React 19 + TypeScript (strict) + Tailwind CSS 4 scaffolding
  - 11 version specs (v0.2.1 ~ v0.9.1) in `specs/`
  - Build-time scripts: generate-diffs, generate-version-meta, generate-versions-index
- Phase 2 (commit `9ad2fd3`):
  - FSD architecture: shared/, widgets/, pages/, app/routes/
  - Shared: cn(), data fetchers, types, hooks, Badge/MethodBadge atoms (CVA)
  - Widgets: Sidebar, Header, AppShell layout
  - Dashboard page: stats cards, version timeline, recent changes
  - Changelog page: filterable, expandable entries
- Phase 3 (commit `229f727`):
  - DiffPage with auto-redirect to latest consecutive pair
  - VersionPicker, GroupTabs, EndpointDiffList, SchemaDiffSection
  - BreakingChangeAlert, DiffSummaryBar components
  - useDiff hook and DiffData types
- Phase 4 (commit `69e0428`):
  - ApiReferencePage with Redoc (lazy-loaded, ~350KB gzip chunk)
  - Version dropdown + API/Internal spec type tabs
  - Redoc dark theme matching app colors
  - copy-specs-to-public.mjs build script (22 spec files across 11 versions)
  - Responsive sidebar: hamburger menu on mobile, overlay with backdrop
  - GitHub Pages SPA routing: 404.html + redirect handler in index.html

## Key Decisions
- **Build-time data pipeline**: oasdiff at build time, React fetches static JSON
- **FSD architecture**: shared/widgets/pages layers, Atomic Design for shared/ui
- **Dark theme default**: Tailwind CSS 4 custom theme tokens
- **Redoc standalone**: React.lazy() code-split, styled-components peer dep
- **SPA routing**: rafgraph/spa-github-pages pattern for 404.html redirect

## Pending Tasks
- [x] Phase 5: CI/CD (GitHub Actions for build + deploy to GitHub Pages)

## Key Files
- `PLAN.md` — Full project plan with all 5 phases
- `src/pages/reference/` — Phase 4 API Reference page (3 files)
- `src/pages/diff/` — Phase 3 Diff View (9 files)
- `src/widgets/app-shell/ui/AppShell.tsx` — Responsive sidebar logic
- `src/widgets/sidebar/ui/Sidebar.tsx` — Nav with mobile close support
- `src/widgets/header/ui/Header.tsx` — Hamburger menu button
- `src/app/routes/index.tsx` — All 4 pages wired with lazy loading
- `scripts/copy-specs-to-public.mjs` — Copies specs to public/data/specs/
- `public/404.html` — GitHub Pages SPA redirect

## Notes
- Run `npm run generate` to rebuild all data files from specs
- oasdiff must be installed (`brew install oasdiff`)
- Build output: ~350KB JS (main) + ~350KB JS (redoc chunk) + 24KB CSS
- v0.9.0→v0.9.1 has 21 breaking changes (largest diff)
- `tsc -b` and `vite build` both pass cleanly
