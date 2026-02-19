# TypeScript Rules: Strict Mode Frontend

## tsconfig.json Requirements

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Type Safety Rules

### No `any` Policy
```typescript
// FORBIDDEN
const data: any = fetchData();
function process(input: any): any { ... }

// ALLOWED alternatives
const data: unknown = fetchData();
function process<T>(input: T): T { ... }
function process(input: Record<string, unknown>): void { ... }
```

### Strict Null Checks
```typescript
// BAD: Non-null assertion
const user = getUser()!;
const name = user!.name;

// GOOD: Proper null handling
const user = getUser();
if (!user) return null;
const name = user.name;

// GOOD: Optional chaining
const name = user?.name ?? 'Anonymous';
```

### Type Assertions (Minimize)
```typescript
// AVOID: Type assertion
const element = document.getElementById('root') as HTMLDivElement;

// PREFER: Type guard
const element = document.getElementById('root');
if (element instanceof HTMLDivElement) {
  // element is HTMLDivElement
}

// OK: API response typing (unavoidable)
const data = await response.json() as ApiResponse;
```

## Component Types

### Props Definition
```typescript
// GOOD: ComponentPropsWithoutRef (inherits native props)
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
};

// GOOD: PropsWithChildren
type LayoutProps = PropsWithChildren<{
  sidebar?: ReactNode;
}>;

// BAD: manually defining all props with interface
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  // ... risk of missing native props
}
```

### Event Handler Types
```typescript
// GOOD: precise event types
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// GOOD: Callback props
type Props = {
  onValueChange: (value: string) => void;
  onSubmit: (data: FormData) => Promise<void>;
};
```

## Utility Types

### Discriminated Unions (State Modeling)
```typescript
// API response state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage
function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle': return null;
    case 'loading': return <Spinner />;
    case 'success': return <Data data={state.data} />;
    case 'error': return <Error error={state.error} />;
  }
}
```

### Branded Types (Type-Safe IDs)
```typescript
type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

// Prevents passing wrong ID type at compile time
function getUser(id: UserId): User { ... }
getUser(productId); // Type Error!
```

### Common Utility Patterns
```typescript
// Partial for updates
type UserUpdate = Partial<Pick<User, 'name' | 'email' | 'avatar'>>;

// Required fields
type CreateUserInput = Required<Pick<User, 'name' | 'email'>>;

// Record for maps
type ErrorMessages = Record<string, string>;
type RouteParams = Record<string, string | undefined>;

// Extract/Exclude for unions
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ReadMethod = Extract<HttpMethod, 'GET'>;
type WriteMethod = Exclude<HttpMethod, 'GET'>;
```

## API Types

### Request/Response
```typescript
// API response wrapper
type ApiResponse<T> = {
  data: T;
  meta?: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
};

// API error
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};

// Type-safe API function
async function fetchUsers(
  params: UserSearchParams
): Promise<ApiResponse<User[]>> {
  const response = await apiClient.get('/users', { params });
  return response.data;
}
```

### Zod Schema (Runtime Validation)
```typescript
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof userSchema>;

// Runtime validation
const parsed = userSchema.safeParse(apiResponse);
if (!parsed.success) {
  console.error(parsed.error.flatten());
}
```

## Module Organization

### Import Order
```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { z } from 'zod';

// 2. Internal modules (@ alias, FSD layer order)
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/atoms';
import { useAuth } from '@/features/auth';

// 3. Relative paths (within same slice)
import { userSchema } from '../model/types';
import styles from './Component.module.css';

// 4. Type imports (type keyword)
import type { User } from '@/entities/user';
import type { ButtonProps } from './types';
```

### Type-Only Imports
```typescript
// GOOD: use type imports for types
import type { User } from '@/entities/user';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

// GOOD: mixed imports
import { useState, type Dispatch, type SetStateAction } from 'react';
```

## Forbidden Patterns

```typescript
// NEVER: enum (prevents tree-shaking)
enum Status { Active, Inactive }

// ALWAYS: const object + as const
const STATUS = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
type Status = (typeof STATUS)[keyof typeof STATUS];

// NEVER: namespace
namespace UserUtils { ... }

// NEVER: @ts-ignore without explanation
// @ts-ignore
risky.code();

// OK: @ts-expect-error with explanation
// @ts-expect-error - legacy API returns string instead of number
const count: number = parseInt(legacyApi.getCount());
```
