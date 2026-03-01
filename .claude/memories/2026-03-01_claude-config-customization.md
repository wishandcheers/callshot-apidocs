# Customize Claude Config for callshot-apidocs

**Date**: 2026-03-01
**Type**: architecture
**Commit**: b18be92

## Summary
Customized the `.claude/` configuration template for the callshot-apidocs project — added domain knowledge system, new agents, condensed rules, and updated skills.

## Key Changes
- CLAUDE.md: project info, tech stack (React 19, Vite 6, Redoc), actual directory structure, `/test` skill mandate
- Domain system: `graph.yaml` scaffold, glossary, `/domain` skill, `domain-scanner` and `domain-updater` agents
- New `interviewer` agent for structured requirements gathering
- All rule files condensed for token efficiency (net -8 lines despite additions)
- Optional rules (storybook, i18n, pwa) moved from `rules/optional/` to `docs/optional-rules/`
- `token-optimization.md` moved from `rules/common/` to `docs/`
- Commit skill updated with domain sync integration (additive vs structural classification)
- Interview skill updated with subagent workflow

## Decisions Made
- Condense over verbose: rules compressed to essential patterns only, reducing context window usage
- Domain knowledge as first-class: graph.yaml checked before codebase scans
- Conservative domain sync: structural changes require manual `/domain scan`, only additive changes auto-sync

## Files Affected
- `.claude/CLAUDE.md` - project customization
- `.claude/agents/` - 3 new agents + domain notes on 8 existing
- `.claude/rules/` - all 7 rule files condensed, 5 files removed/moved
- `.claude/skills/` - commit + interview updated, domain skill added
- `.claude/domain/` - scaffolded with graph.yaml, glossary, README

## Notes for Future
- Domain entities/contexts/workflows directories are empty — run `/domain scan` to populate
- Optional rules are now in `docs/optional-rules/` and must be referenced with `@docs/` prefix
