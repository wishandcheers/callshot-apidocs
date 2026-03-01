# Frontend Architecture: Feature-Sliced Design + Atomic Design

Framework-agnostic (React, Vue, Svelte). Combines FSD layers with Atomic Design in `shared/ui`.

## Layer Structure (FSD)

```
src/
├── app/          # Providers, routes, global styles, entry point
├── pages/        # Route entry points (ui/, model/, api/, index.ts)
├── widgets/      # Large composite blocks (ui/, model/, index.ts)
├── features/     # User interactions (ui/, model/, api/, lib/, index.ts)
├── entities/     # Business entities (ui/, model/, api/, index.ts)
└── shared/
    ├── ui/       # atoms/ → molecules/ → organisms/
    ├── lib/      # cn(), formatDate(), debounce()
    ├── api/      # API client, interceptors
    ├── config/   # Environment, constants
    ├── hooks/    # Shared custom hooks
    └── types/    # Shared type definitions
```

## Dependency Rules (Critical)

```
app → pages → widgets → features → entities → shared
                Higher to Lower ONLY ►
```

| Layer | Can Import | Cannot Import |
|-------|-----------|---------------|
| shared | External libraries only | All other layers |
| entities | shared | features, widgets, pages, app |
| features | entities, shared | widgets, pages, app |
| widgets | features, entities, shared | pages, app |
| pages | widgets, features, entities, shared | app |
| app | All lower layers | - |

**Cross-slice import forbidden** — no direct import between slices in the same layer:
```typescript
// BAD: features/cart importing from features/auth
import { useAuth } from '@/features/auth/model';
// GOOD: compose in higher layer (widgets/checkout)
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart';
```

## Slice Structure

Each slice: `ui/` (components) + `model/` (state, types) + `api/` (queries) + `lib/` (utils) + `index.ts` (public API).

```typescript
// features/auth/index.ts — export only public API
export { LoginForm } from './ui/LoginForm';
export { useAuth } from './model/auth.store';
export type { User, AuthState } from './model/types';
// Internal: useTokenRefresh, parseJwt NOT exported
```

## Atomic Design in shared/ui

| Level | Description | Examples |
|-------|-------------|---------|
| **Atoms** | Smallest indivisible, no business logic | Button, Input, Label, Badge, Icon |
| **Molecules** | Atom combinations, single purpose | SearchBar, FormField, Card |
| **Organisms** | Complex blocks, independently meaningful | Header, DataTable, Modal |

Import rule: Atoms use primitives only → Molecules use atoms → Organisms use atoms + molecules.

## Anti-Patterns

1. **Circular Dependencies**: References within same layer
2. **God Component**: All logic in one component
3. **Prop Drilling**: Use state management instead
4. **FSD Layer Bypass**: Importing from higher layers
5. **Barrel File Bloat**: Unnecessary re-exports increasing bundle
6. **Business Logic in shared/ui**: Domain knowledge in shared components
7. **Direct API in Component**: Call fetch/axios directly in components
