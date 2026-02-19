# Commit Conventions for Frontend

## Type Selection

| Files Changed | Type |
|---------------|------|
| `*.tsx`, `*.vue`, `*.svelte` (new component) | feat |
| `*.tsx` (bug fix) | fix |
| `*.test.ts`, `*.test.tsx`, `*.spec.ts` | test |
| `*.css`, `tailwind.config.*` | style |
| `vite.config.*`, `tsconfig.*`, `package.json` | chore |
| `*.md`, `*.stories.tsx` | docs |
| Performance-related changes | perf |

## Scope Mapping

| Path | Scope |
|------|-------|
| `src/shared/ui/atoms/` | ui |
| `src/shared/ui/molecules/` | ui |
| `src/shared/ui/organisms/` | ui |
| `src/shared/lib/` | lib |
| `src/shared/api/` | api |
| `src/features/auth/` | auth |
| `src/features/search/` | search |
| `src/features/*/` | {feature-name} |
| `src/entities/*/` | {entity-name} |
| `src/pages/*/` | page |
| `src/widgets/*/` | layout |
| `src/app/` | app |
| `tailwind.config.*`, `postcss.*` | style |
| `vite.config.*` | build |
| `vitest.*`, `*.test.*` | test |

## Examples

### New Component
```
feat(ui): add Button component with CVA variants

- Default, destructive, outline, ghost variants
- sm, default, lg sizes
- forwardRef + className support
```

### Bug Fix
```
fix(modal): resolve focus trap on close

Focus was not returning to trigger element
when modal closed via Escape key.
```

### Feature
```
feat(auth): implement login form with validation

- Zod schema for email/password validation
- useAuth hook for auth state management
- MSW mock for auth API endpoint
```

### Performance
```
perf(table): virtualize data table rows

Replace full render with @tanstack/react-virtual.
Handles 10k+ rows without jank.
```

### Refactoring
```
refactor(form): extract useFormValidation hook

Move duplicate validation logic from LoginForm
and RegisterForm into shared hook.
```

### Test
```
test(auth): add LoginForm integration tests

Cover success, validation error, API failure.
```

### Dependency Update
```
chore(deps): upgrade vitest to 3.x
```

## Post-Commit Reminders

**If shared/ui component changed:**
Update Storybook stories (if applicable).

**If config changed:**
Review build output for regressions.
