# Memory Logging Rules

> **Record only key decisions and significant changes.**
> Selectively log important work (not every conversation) to prevent context loss.

## Location

```
.claude/memories/
├── YYYY-MM-DD_title.md
└── ...
```

## When to Log

Automatically record in these situations:

| Condition | Example |
|-----------|---------|
| New feature/component added | New feature, new shared/ui component |
| Architecture decision | FSD layer structure change, state management strategy |
| Significant bug fix | Root cause analysis + solution |
| Config/environment change | vite.config, tailwind.config, tsconfig |
| Dependency change | Major library added/upgraded |
| Build/bundle optimization | Code splitting, tree shaking changes |
| Refactoring | Structural changes |

## When NOT to Log

- Simple Q&A
- Code explanation requests
- Minor fixes (typos, formatting)
- Exploration/search only
- Test execution only

## File Format

```markdown
# {Title}

**Date**: YYYY-MM-DD
**Type**: feature | fix | refactor | config | architecture

## Request
{1-2 sentence summary of user's request}

## Decision/Action
{What was decided and implemented}

## Key Changes
- {change 1}
- {change 2}
- {change 3}

## Rationale
{Why this approach was chosen, what alternatives existed}

## Files Modified
- `path/to/file1`
- `path/to/file2`

## Notes
{Future reference, caveats}
```

## Filename Convention

```
YYYY-MM-DD_brief-title.md

Examples:
2026-01-31_auth-feature-added.md
2026-01-31_modal-focus-trap-fix.md
2026-02-01_code-splitting-strategy.md
```

## Frontend-Specific Example

```markdown
# Add Auth Feature with Login Form

**Date**: 2026-01-31
**Type**: feature

## Request
Implement login form with OAuth2 authentication flow.

## Decision/Action
- Created features/auth slice (FSD structure)
- LoginForm component (CVA variants, Zod validation)
- useAuth hook for auth state management

## Key Changes
- features/auth/ui/LoginForm.tsx
- features/auth/model/auth.store.ts
- features/auth/api/auth.api.ts
- shared/ui/atoms/Input.tsx (new)

## Rationale
- Token storage: in-memory (XSS prevention, httpOnly cookie alternative)
- Zod validation: runtime + type safety combined
- CVA variants: style separation by form state

## Files Modified
- `src/features/auth/`
- `src/shared/ui/atoms/Input.tsx`
- `src/app/providers/AuthProvider.tsx`

## Notes
- Refresh token rotation pending backend implementation
- Social login UI planned for next sprint
```

## .gitignore Option

If memories may contain sensitive information:
```gitignore
# Optional: exclude memories from git
# .claude/memories/
```

Generally recommended to **include in git** for team sharing.
