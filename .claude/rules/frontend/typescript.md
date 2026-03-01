# TypeScript Rules: Strict Mode Frontend

## tsconfig.json Requirements

```json
{
  "compilerOptions": {
    "strict": true, "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true, "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true, "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true, "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true, "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Type Safety Rules

- **No `any`**: Use `unknown`, generics, or `Record<string, unknown>` instead
- **No non-null assertion (`!`)**: Use proper null checks or optional chaining (`?.` / `??`)
- **Minimize type assertions**: Prefer `instanceof` type guards; `as` OK only for API responses

## Component Types

```typescript
// Inherit native props with ComponentPropsWithoutRef
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
};

// Use PropsWithChildren for layout components
type LayoutProps = PropsWithChildren<{ sidebar?: ReactNode }>;

// Use precise event types: ChangeEvent<HTMLInputElement>, FormEvent<HTMLFormElement>
// Callback props: onValueChange: (value: string) => void
```

## Discriminated Unions (State Modeling)

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## Branded Types

```typescript
type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };
// Prevents passing wrong ID type at compile time
```

## Common Utility Patterns

```typescript
Partial<Pick<User, 'name' | 'email'>>     // Updates
Required<Pick<User, 'name' | 'email'>>    // Creation
Record<string, string | undefined>         // Maps
Extract<HttpMethod, 'GET'>                 // Union filtering
Exclude<HttpMethod, 'GET'>                 // Union exclusion
```

## API Types

```typescript
type ApiResponse<T> = {
  data: T;
  meta?: { page: number; totalPages: number; totalItems: number };
};
type ApiError = {
  code: string; message: string;
  details?: Record<string, string[]>;
};
```

## Zod Schema (Runtime Validation)

```typescript
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
});
type User = z.infer<typeof userSchema>;
// Use safeParse() for runtime validation
```

## Import Order

1. External libraries (`react`, `zod`)
2. Internal modules (`@/shared/`, `@/features/` -- FSD layer order)
3. Relative paths (`../model/types`, `./Component.module.css`)
4. Type-only imports (`import type { User }`)

Use `import type` for type-only imports. Use inline `type` for mixed: `import { useState, type Dispatch } from 'react'`.

## Forbidden Patterns

| Pattern | Rule | Alternative |
|---------|------|-------------|
| `enum` | NEVER (prevents tree-shaking) | `const OBJ = {...} as const` + derived type |
| `namespace` | NEVER | ES modules |
| `@ts-ignore` | NEVER without explanation | `@ts-expect-error` with comment |
| `any` | NEVER | `unknown` + type guard |
