# Git Workflow Guidelines

## Branch Strategy

### Branch Naming
```
<type>/<ticket-id>-<short-description>

Examples:
feature/PROJ-123-user-auth-form
bugfix/PROJ-456-fix-modal-overflow
hotfix/PROJ-789-xss-vulnerability
refactor/PROJ-101-extract-form-hooks
chore/PROJ-202-update-dependencies
```

### Branch Types
| Type | Purpose | Base Branch |
|------|---------|-------------|
| `feature/` | New functionality | `develop` |
| `bugfix/` | Bug fixes | `develop` |
| `hotfix/` | Production emergency | `main` |
| `refactor/` | Code improvements | `develop` |
| `chore/` | Maintenance tasks | `develop` |

## Commit Messages

### Conventional Commits Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |

### Scopes (Frontend)
```
ui, auth, layout, form, modal, table, nav, chart,
api, store, router, config, a11y, i18n, build
```

### Examples
```
feat(auth): add login form with validation

fix(modal): resolve focus trap on close

refactor(form): extract useFormValidation hook

perf(table): virtualize large data tables

test(auth): add integration tests for login flow

chore(deps): upgrade vitest to 3.x
```

### Commit Message Rules

1. **Subject line**: Max 50 characters, imperative mood
2. **Body**: Wrap at 72 characters, explain what and why
3. **Footer**: Reference issues, breaking changes

```
feat(auth): implement OAuth2 login flow

Add Google and Apple OAuth2 provider support.
Uses PKCE flow for enhanced security.

- Add OAuth2 callback handler
- Implement token exchange
- Add provider selection UI

Closes #123
```

## Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/PROJ-123-new-feature

# 2. Make atomic commits
git add -p
git commit -m "feat(scope): implement part 1"

# 3. Keep branch updated
git fetch origin
git rebase origin/develop

# 4. Push for review
git push -u origin feature/PROJ-123-new-feature
```

### Atomic Commits
Each commit should:
- Be self-contained and buildable
- Pass all tests and type checks
- Do ONE logical thing
- Be revertable without side effects

```bash
# Good: Atomic commits
git commit -m "feat(ui): add Button component with CVA variants"
git commit -m "feat(auth): implement LoginForm component"
git commit -m "test(auth): add LoginForm unit tests"

# Bad: Monolithic commit
git commit -m "feat(auth): implement entire auth feature"
```

## Protected Actions

### NEVER Do
```bash
git push --force origin main
git push -f origin develop
git reset --hard origin/develop
git branch -D feature-in-progress
```

### Safe Practices
```bash
git push --force-with-lease origin feature/my-branch
git rebase -i HEAD~5
git pull --rebase origin develop
```

## Merge Strategy

### Feature -> Develop
**Squash merge** to keep clean history.

### Develop -> Main
**Merge commit** to preserve history.
