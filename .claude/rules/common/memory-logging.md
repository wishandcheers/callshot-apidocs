# Memory Logging Rules

> Record only key decisions and significant changes. Selectively log important work to prevent context loss.

## Location

```
.claude/memories/YYYY-MM-DD_brief-title.md
```

## When to Log

| Condition | Example |
|-----------|---------|
| New feature/component added | New feature, shared/ui component |
| Architecture decision | FSD structure change, state management |
| Significant bug fix | Root cause + solution |
| Config/environment change | vite.config, tailwind.config, tsconfig |
| Dependency change | Major library added/upgraded |
| Build/bundle optimization | Code splitting, tree shaking |
| Refactoring | Structural changes |

## When NOT to Log

Simple Q&A, code explanations, minor fixes (typos/formatting), exploration/search only, test execution only.

## File Format

```markdown
# {Title}
**Date**: YYYY-MM-DD | **Type**: feature | fix | refactor | config | architecture
## Request
{1-2 sentence summary}
## Decision/Action
{What was decided and implemented}
## Key Changes
- {change 1}  - {change 2}
## Rationale
{Why this approach, what alternatives existed}
## Files Modified / Notes
- `path/to/file1`  - `path/to/file2` | Notes: {future reference, caveats}
```

## Filename Convention

```
YYYY-MM-DD_brief-title.md

Examples:
2026-01-31_auth-feature-added.md
2026-01-31_modal-focus-trap-fix.md
2026-02-01_code-splitting-strategy.md
```

## .gitignore Option

If memories contain sensitive info, add `.claude/memories/` to `.gitignore`. Generally recommended to **include in git** for team sharing.
