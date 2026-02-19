# Test Patterns for Frontend

## Common Commands

### Run All Tests
```bash
# Minimal output (default for skill)
npx vitest run --reporter=dot

# Full output (for debugging)
npx vitest run --reporter=verbose
```

### Run Specific Tests
```bash
# Single file
npx vitest run src/shared/lib/cn.test.ts

# Pattern matching
npx vitest run --grep "LoginForm"

# Specific directory
npx vitest run src/features/auth/

# Changed files only
npx vitest run --changed

# Watch mode
npx vitest
```

### Coverage
```bash
# With coverage report
npx vitest run --coverage

# Coverage for specific directory
npx vitest run --coverage src/shared/
```

## Testing Library Patterns

### Query Priority
```typescript
// 1st: Accessible queries (best)
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email');

// 2nd: Semantic queries
screen.getByPlaceholderText('Search...');
screen.getByText('Welcome');

// Last resort
screen.getByTestId('custom-element');
```

### User Events (always use setup)
```typescript
const user = userEvent.setup();

// Typing
await user.type(screen.getByLabelText('Email'), 'test@test.com');

// Clicking
await user.click(screen.getByRole('button', { name: 'Submit' }));

// Keyboard
await user.keyboard('{Escape}');
await user.tab();

// Clearing input
await user.clear(screen.getByLabelText('Email'));
```

### Async Queries
```typescript
// Wait for element to appear
const toast = await screen.findByRole('alert');

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

// Custom wait
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## MSW Patterns

### Basic Handler
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json([{ id: '1', name: 'John' }])
  ),
];
```

### Override in Test
```typescript
import { server } from '@/shared/api/__mocks__/server';

it('should handle API error', async () => {
  server.use(
    http.get('/api/users', () =>
      HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    )
  );

  render(<UserList />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Unauthorized');
});
```

### Network Error
```typescript
server.use(
  http.get('/api/users', () => HttpResponse.error())
);
```

## Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';

it('should toggle state', () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current[0]).toBe(false);

  act(() => result.current[1]());

  expect(result.current[0]).toBe(true);
});
```

## Common Failure Patterns

### Unable to find role
```
Cause: Component not rendering or wrong query
Fix: Check render output with screen.debug()
```

### act() warning
```
Cause: State update after test completes
Fix: Use findBy queries, await async operations
```

### Mock not called
```
Cause: Wrong mock path or mock not hoisted
Fix: Use vi.mock() at top level, check import paths
```

### Timeout
```
Cause: Async operation never resolves
Fix: Check mock returns, increase timeout if needed
```

### Hydration mismatch
```
Cause: Server/client render difference
Fix: Use useEffect for client-only values
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run tests
  run: npx vitest run --reporter=dot

- name: Run with coverage
  run: npx vitest run --coverage

- name: Upload coverage
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
```
