# PR Review Checklist for Frontend

## Architecture (FSD)

### Layer Rules
- [ ] Dependencies flow top-to-bottom only
- [ ] No cross-slice imports within same layer
- [ ] Public API (index.ts) used for external imports
- [ ] Correct layer placement for new slices
- [ ] shared/ui follows Atomic Design (atoms → molecules → organisms)

### Anti-Patterns
```typescript
// Cross-slice import (BAD)
// features/cart/model/cart.store.ts
import { useAuth } from '@/features/auth/model/auth.store';

// Deep import bypassing public API (BAD)
import { loginSchema } from '@/features/auth/model/schemas';
// Should be:
import { loginSchema } from '@/features/auth';
```

## TypeScript Quality

### Type Safety
- [ ] No `any` types
- [ ] No non-null assertions (`!`) without justification
- [ ] No unsafe type assertions (`as`)
- [ ] `type` keyword for type-only imports
- [ ] Discriminated unions for state modeling
- [ ] `as const` instead of `enum`

### Anti-Patterns
```typescript
// Loose typing (BAD)
const data: any = response.data;

// Unsafe assertion (BAD)
const el = document.getElementById('root') as HTMLDivElement;

// Missing exhaustive check (BAD)
switch (state.status) {
  case 'idle': return null;
  case 'loading': return <Spinner />;
  // Missing 'success' and 'error' cases!
}
```

## Component Patterns

### CVA/Tailwind
- [ ] CVA for variant-based components
- [ ] `cn()` for class merging (no string concat)
- [ ] Design tokens via CSS variables
- [ ] No inline styles
- [ ] No dynamic class construction
- [ ] `ComponentPropsWithoutRef` for native props
- [ ] `forwardRef` for DOM access
- [ ] `className` prop for customization

### Composition
- [ ] Compound components for complex UI
- [ ] No excessive prop drilling
- [ ] `asChild` pattern where applicable

## Accessibility

### Must Check
- [ ] Semantic HTML elements (`button`, `nav`, `main`)
- [ ] `aria-label` for icon-only interactive elements
- [ ] Focus indicators visible (`focus-visible:ring-*`)
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers (`role="alert"`)
- [ ] Color not sole means of conveying information
- [ ] Keyboard navigation works (Tab, Enter, Escape)

### Anti-Patterns
```typescript
// div soup (BAD)
<div onClick={handleClick}>Click me</div>

// Missing label (BAD)
<button><XIcon /></button>

// Color-only error (BAD)
<input className={error ? 'border-red-500' : ''} />
```

## Testing

### Coverage Requirements
- [ ] Unit tests for new utility functions
- [ ] Component tests for new UI components
- [ ] Integration tests for feature flows
- [ ] MSW handlers for API endpoints

### Test Quality
- [ ] Testing Library queries by role/label (not testId)
- [ ] `userEvent.setup()` for interactions
- [ ] Proper async handling (findBy, waitFor)
- [ ] No implementation detail testing
- [ ] AAA pattern (Arrange/Act/Assert)

## Performance

### Bundle
- [ ] No unnecessary large dependencies
- [ ] Tree-shakeable imports (named, not default)
- [ ] Route-level code splitting for pages

### Rendering
- [ ] No new object/array literals in render
- [ ] Heavy computations memoized
- [ ] Images have width/height (no CLS)
- [ ] Images lazy loaded (below fold)

## Verdict Criteria

### Approve
- No critical/high issues
- Architecture compliant
- TypeScript strict mode passes
- Tests adequate

### Request Changes
- Architecture violations (wrong layer, cross-slice)
- `any` types or unsafe assertions
- Missing accessibility for interactive elements
- No tests for new features

### Comment Only
- Minor suggestions
- Style preferences
- Non-blocking improvements
