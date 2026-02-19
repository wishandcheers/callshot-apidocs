# Frontend Architecture: Feature-Sliced Design + Atomic Design

## Overview

A frontend architecture combining FSD (Feature-Sliced Design) with Atomic Design.
Framework-agnostic: applicable to React, Vue, Svelte, or any framework.

## Layer Structure (FSD)

```
src/
├── app/                    # APPLICATION LAYER
│   ├── providers/          # Global Provider/Context setup
│   ├── routes/             # Routing configuration
│   ├── styles/             # Global styles, Tailwind setup
│   └── index.ts            # App entry point
│
├── pages/                  # PAGE LAYER
│   └── [page-name]/
│       ├── ui/             # Page components
│       ├── model/          # Page state/logic
│       ├── api/            # Page-specific API calls
│       └── index.ts        # Public API
│
├── widgets/                # WIDGET LAYER
│   └── [widget-name]/
│       ├── ui/             # Widget components
│       ├── model/          # Widget state/logic
│       └── index.ts        # Public API
│
├── features/               # FEATURE LAYER
│   └── [feature-name]/
│       ├── ui/             # Feature UI
│       ├── model/          # Business logic, state
│       ├── api/            # API calls
│       ├── lib/            # Feature-specific utilities
│       └── index.ts        # Public API
│
├── entities/               # ENTITY LAYER
│   └── [entity-name]/
│       ├── ui/             # Entity UI (UserCard, ProductItem)
│       ├── model/          # Entity types, stores
│       ├── api/            # Entity CRUD API
│       └── index.ts        # Public API
│
└── shared/                 # SHARED LAYER
    ├── ui/                 # Atomic Design components
    │   ├── atoms/          # Button, Input, Label, Icon
    │   ├── molecules/      # SearchBar, FormField, Card
    │   └── organisms/      # Header, DataTable, Modal
    ├── lib/                # Utilities (cn(), formatDate(), debounce())
    ├── api/                # API client, interceptors
    ├── config/             # Environment config, constants
    ├── hooks/              # Shared custom hooks
    └── types/              # Shared type definitions
```

## Dependency Rules (Critical)

### The Golden Rule
**Dependencies MUST flow top-to-bottom only.**

```
app → pages → widgets → features → entities → shared
───────────────────────────────────────────────────►
                Higher to Lower ONLY
```

### Layer Restrictions

| Layer | Can Import | Cannot Import |
|-------|-----------|---------------|
| shared | External libraries only | All other layers |
| entities | shared | features, widgets, pages, app |
| features | entities, shared | widgets, pages, app |
| widgets | features, entities, shared | pages, app |
| pages | widgets, features, entities, shared | app |
| app | All lower layers | - |

### Cross-Slice Import Forbidden

No direct import between slices within the same layer:
```typescript
// FORBIDDEN: feature importing from another feature
// features/cart/model/cart.store.ts
import { useAuth } from '@/features/auth/model';  // BAD

// ALLOWED: compose in higher layer
// widgets/checkout/ui/Checkout.tsx
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart';
```

## Slice Structure

Each slice follows the same segment structure:

```
[slice-name]/
├── ui/            # Components (presentation)
│   ├── Component.tsx
│   └── index.ts
├── model/         # State, business logic
│   ├── types.ts   # Type definitions
│   ├── store.ts   # State management
│   └── index.ts
├── api/           # API calls
│   ├── queries.ts # Data fetching
│   └── index.ts
├── lib/           # Slice-specific utilities
└── index.ts       # Public API (barrel file)
```

### Public API (index.ts)

Export only what is intentionally exposed:
```typescript
// features/auth/index.ts
export { LoginForm } from './ui/LoginForm';
export { useAuth } from './model/auth.store';
export type { User, AuthState } from './model/types';

// Internal implementation NOT exported
// useTokenRefresh, parseJwt are internal only
```

## Atomic Design in shared/ui

### Atoms
- Smallest indivisible UI elements
- No business logic, controlled by props only
- Examples: Button, Input, Label, Badge, Icon, Spinner

### Molecules
- Combinations of atoms, single purpose
- Examples: SearchBar (Input + Button), FormField (Label + Input + Error)

### Organisms
- Complex UI blocks, independently meaningful
- Examples: Header, DataTable, Modal, Sidebar

### Rules
```typescript
// Atoms: use only framework primitives
// shared/ui/atoms/Button.tsx
const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

// Molecules: use only atoms
// shared/ui/molecules/SearchBar.tsx
import { Button, Input } from '@/shared/ui/atoms';

// Organisms: use atoms + molecules
// shared/ui/organisms/Header.tsx
import { Button } from '@/shared/ui/atoms';
import { SearchBar } from '@/shared/ui/molecules';
```

## Anti-Patterns to Avoid

1. **Circular Dependencies**: Circular references within same layer
2. **God Component**: All logic concentrated in one component
3. **Prop Drilling**: Deep props passing (use state management instead)
4. **FSD Layer Bypass**: Skipping upper layers to import
5. **Barrel File Bloat**: Unnecessary re-exports increasing bundle size
6. **Business Logic in shared/ui**: Domain knowledge in shared UI components
7. **Direct API Call in Component**: Calling fetch/axios directly in components
