# PR Templates for Frontend

## Full PR Body Template

```markdown
## Summary
Brief description of what this PR accomplishes.

## Changes
- [ ] Change 1
- [ ] Change 2

## Type of Change
- [ ] New feature (component, page, feature slice)
- [ ] Bug fix
- [ ] Refactoring
- [ ] Performance improvement
- [ ] Tests
- [ ] Configuration

## Architecture Impact
- FSD layers affected: shared / entities / features / widgets / pages
- New slices created: None / List them
- Cross-cutting concerns: None / Describe

## Component Changes
- [ ] New shared/ui components added
- [ ] CVA variants follow patterns
- [ ] Tailwind classes use design tokens
- [ ] Accessibility requirements met

## Testing
- [ ] Unit tests added/updated
- [ ] Component tests with Testing Library
- [ ] Integration tests with MSW
- [ ] Manual testing completed

## Performance
- [ ] Bundle size impact assessed
- [ ] Code splitting applied (if needed)
- [ ] Images optimized
- [ ] No unnecessary re-renders

## Checklist
- [ ] TypeScript strict mode passes (no any, no !)
- [ ] FSD layer dependencies correct
- [ ] Accessibility WCAG 2.2 AA
- [ ] No sensitive data exposed
```

## Component Change Section

```markdown
## New Components
| Component | Layer | Type | Variants |
|-----------|-------|------|----------|
| Button | shared/ui/atoms | CVA | default, destructive, outline |
| SearchBar | shared/ui/molecules | Compound | - |

### Accessibility
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] Color contrast AA compliant
```

## Performance Impact Section

```markdown
## Performance Impact
- Bundle size change: +X KB / -X KB
- New dependencies: `package-name` (+X KB gzipped)
- Code splitting: Route-level / Component-level / N/A
- Rendering: No impact / Optimized with memo/useMemo

### Lighthouse Scores (if applicable)
| Metric | Before | After |
|--------|--------|-------|
| Performance | X | X |
| Accessibility | X | X |
| Best Practices | X | X |
```

## API Change Section

```markdown
## API Changes
| Endpoint | Method | Change |
|----------|--------|--------|
| `/api/users` | GET | New consumer |
| `/api/auth/login` | POST | Modified request body |

### MSW Mocks Updated
- [ ] handlers.ts updated
- [ ] Integration tests cover new endpoints
```

## Labels

```bash
gh pr edit --add-label "enhancement"     # feat
gh pr edit --add-label "bug"             # fix
gh pr edit --add-label "ui"              # component changes
gh pr edit --add-label "accessibility"   # a11y changes
gh pr edit --add-label "performance"     # perf changes
```
