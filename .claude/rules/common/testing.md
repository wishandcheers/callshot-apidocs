# Testing Standards: Vitest + Testing Library + MSW

## Test Framework Stack

- **Vitest**: Fast, ESM-native test runner (Vite-powered)
- **Testing Library**: DOM-centric, accessibility-first testing
- **MSW (Mock Service Worker)**: API mocking at network level
- **@testing-library/user-event**: Realistic user interaction simulation

## Test Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /----\     - Playwright, real browser
     /      \
    /        \   Integration Tests (20%)
   /----------\  - Component + API mock
  /            \
 /              \ Unit Tests (70%)
/----------------\ - Utils, hooks, pure logic
```

## Test Structure

```typescript
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('LoginForm', () => {
  const user = userEvent.setup();

  it('should submit form with valid credentials', async () => {
    // Arrange
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'invalid');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });
});
```

## Testing Library Queries (Priority)

### Accessibility First
```typescript
// 1st: getByRole (most recommended)
screen.getByRole('button', { name: 'Submit' });
screen.getByRole('textbox', { name: 'Email' });
screen.getByRole('heading', { level: 1 });

// 2nd: getByLabelText (form elements)
screen.getByLabelText('Password');

// 3rd: getByPlaceholderText
screen.getByPlaceholderText('Search...');

// 4th: getByText (static text)
screen.getByText('Welcome back');

// LAST RESORT: getByTestId
screen.getByTestId('custom-element');  // only when no other option
```

### Query Types
```typescript
// getBy: element must exist (throws if not found)
const button = screen.getByRole('button');

// queryBy: element may not exist (returns null if not found)
expect(screen.queryByRole('alert')).not.toBeInTheDocument();

// findBy: async (waits for element to appear)
const toast = await screen.findByRole('alert');
```

## Test Categories

### 1. Unit Tests (Pure Logic)
```typescript
// shared/lib/cn.test.ts
describe('cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('px-4 py-1');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });
});
```

### 2. Component Tests (UI + Interaction)
```typescript
describe('Button', () => {
  it('should render with correct variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('should be disabled when loading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 3. Integration Tests (Component + API)
```typescript
import { server } from '@/shared/api/__mocks__/server';
import { http, HttpResponse } from 'msw';

describe('UserProfile', () => {
  it('should display user data after fetch', async () => {
    server.use(
      http.get('/api/users/1', () =>
        HttpResponse.json({ name: 'John', email: 'john@test.com' })
      )
    );

    render(<UserProfile userId="1" />);

    expect(await screen.findByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });
});
```

## MSW Setup

### Handler Definition
```typescript
// shared/api/__mocks__/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json([
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ])
  ),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@test.com') {
      return HttpResponse.json({ token: 'mock-token' });
    }
    return HttpResponse.json({ error: 'Invalid' }, { status: 401 });
  }),
];
```

### Server Setup
```typescript
// shared/api/__mocks__/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Vitest Setup
```typescript
// vitest.setup.ts
import { server } from '@/shared/api/__mocks__/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => result.current.increment());

    expect(result.current.count).toBe(1);
  });
});
```

## Coverage Requirements

| Area | Minimum Coverage |
|------|------------------|
| shared/lib | 90% |
| shared/ui | 80% |
| features (model) | 85% |
| features (ui) | 75% |
| Overall | 80% |

## Common Commands

```bash
# Run all tests
npx vitest run

# Watch mode
npx vitest

# Specific file
npx vitest run src/shared/lib/cn.test.ts

# Coverage report
npx vitest run --coverage

# UI mode
npx vitest --ui
```

## Test Naming Convention
```typescript
// Pattern: describe(component) > it(should + expected behavior)
describe('SearchBar', () => {
  it('should call onSearch when form submitted');
  it('should debounce input by 300ms');
  it('should clear input when reset clicked');
  it('should show suggestions when input has 2+ characters');
});
```
