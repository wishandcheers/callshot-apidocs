# Git Workflow Guidelines

## Branch Naming

```
<type>/<ticket-id>-<short-description>
```

| Type | Purpose | Base Branch |
|------|---------|-------------|
| `feature/` | New functionality | `develop` |
| `bugfix/` | Bug fixes | `develop` |
| `hotfix/` | Production emergency | `main` |
| `refactor/` | Code improvements | `develop` |
| `chore/` | Maintenance tasks | `develop` |

## Conventional Commits

```
<type>(<scope>): <description>
```

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting) |
| `refactor` | Neither fix nor feature |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Build, deps, tooling |

**Scopes**: `ui, auth, layout, form, modal, table, nav, chart, api, store, router, config, a11y, i18n, build`

**Rules**: Subject max 50 chars, imperative mood. Body wraps at 72 chars. Footer: issue refs, breaking changes.

## Workflow

```bash
# Feature branch
git checkout develop && git pull origin develop
git checkout -b feature/PROJ-123-new-feature
git add -p && git commit -m "feat(scope): implement part 1"
git fetch origin && git rebase origin/develop
git push -u origin feature/PROJ-123-new-feature
```

### Atomic Commits

Each commit: self-contained, buildable, passes tests, does ONE thing, revertable.

## Protected Actions

### NEVER
```bash
git push --force origin main       # or develop
git reset --hard origin/develop
git branch -D feature-in-progress
```

### Safe Alternatives
```bash
git push --force-with-lease origin feature/my-branch
git pull --rebase origin develop
```

## Merge Strategy

- **Feature -> Develop**: Squash merge (clean history)
- **Develop -> Main**: Merge commit (preserve history)
