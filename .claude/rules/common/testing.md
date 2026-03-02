---
paths:
  - "**/*Test*"
  - "**/*test*"
  - "**/*Spec*"
  - "**/*spec*"
  - "**/__tests__/**"
  - "**/*.test.*"
  - "**/*.spec.*"
---

# Testing: Vitest + Testing Library + MSW

## Stack & Pyramid

- **Vitest**: ESM-native test runner | **Testing Library**: Accessibility-first | **MSW**: Network-level API mocking
- **70% Unit** (utils, hooks, pure logic) → **20% Integration** (component + API mock) → **10% E2E** (Playwright, real browser)

## Query Priority (Accessibility First)

| Priority | Query | Use For |
|----------|-------|---------|
| 1st | `getByRole('button', { name })` | Most elements |
| 2nd | `getByLabelText('Email')` | Form elements |
| 3rd | `getByPlaceholderText(...)` | Inputs |
| 4th | `getByText(...)` | Static text |
| Last | `getByTestId(...)` | Only when no other option |

**Query types**: `getBy` (must exist, throws) | `queryBy` (may not exist, returns null) | `findBy` (async, waits)

## Test Structure Pattern

```typescript
// Arrange-Act-Assert with userEvent.setup()
const user = userEvent.setup();
render(<Component />);
await user.type(screen.getByLabelText('Email'), 'test@example.com');
await user.click(screen.getByRole('button', { name: 'Submit' }));
expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
```

## Test Categories

### Unit Tests — pure logic, utils
```typescript
describe('cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('px-4 py-1');
  });
});
```

### Component Tests — render + interaction
```typescript
render(<Button variant="destructive">Delete</Button>);
expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-destructive');
```

### Integration Tests — component + MSW
```typescript
server.use(http.get('/api/users/1', () => HttpResponse.json({ name: 'John' })));
render(<UserProfile userId="1" />);
expect(await screen.findByText('John')).toBeInTheDocument();
```

## MSW Setup

```typescript
// shared/api/__mocks__/handlers.ts — define handlers with http.get/post + HttpResponse.json
// shared/api/__mocks__/server.ts  — setupServer(...handlers)
// vitest.setup.ts:
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Hook Testing

```typescript
const { result } = renderHook(() => useCounter(0));
act(() => result.current.increment());
expect(result.current.count).toBe(1);
```

## Coverage Requirements

| Area | Min |
|------|-----|
| shared/lib | 90% |
| shared/ui | 80% |
| features (model) | 85% |
| features (ui) | 75% |
| **Overall** | **80%** |

## Commands

```bash
npx vitest run                          # All tests
npx vitest run src/path/file.test.ts    # Specific file
npx vitest run --coverage               # Coverage report
npx vitest                              # Watch mode
npx vitest --ui                         # UI mode
```

## Naming Convention

Pattern: `describe('Component')` > `it('should + expected behavior')`
