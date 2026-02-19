# Question Bank (React/TypeScript/FSD)

Select questions based on the request type detected in Phase 1. Reference codebase scan results when framing each question.

## Feature Request (feat)

### FSD Layer Placement
- "Found existing slices: {slices}. Should this be a new feature, or extend {closest_slice}?"
- "Which FSD layer? (feature for user interactions, entity for data model, widget for composite block)"

### Component Design
- "Does this need new shared/ui components? (atoms, molecules, organisms)"
- "Found existing {component}. Should we extend its variants (CVA) or create a new component?"

### State Management
- "What state does this feature manage? (local component state, shared store, server state)"
- "Found existing store pattern using {store_lib}. Follow the same pattern?"

### API Integration
- "Does this feature need API calls? Found existing API client at {path}."
- "What shape is the API response? Should we add Zod schema validation?"

### Routing
- "Does this need a new route/page? Found existing routes: {routes}."
- "Should this be a nested route under an existing page or a top-level page?"

### Accessibility
- "Any specific a11y requirements? (ARIA roles, keyboard navigation, screen reader)"
- "Does this include form inputs that need proper labeling and error states?"

### Styling
- "Found existing design tokens: {tokens}. Should this use existing tokens or define new ones?"
- "Does this need responsive behavior? (mobile-first breakpoints)"

### Testing
- "What testing priority: component tests (Testing Library), hook tests, or integration with MSW?"
- "Found existing test patterns in {test_file}. Follow the same structure?"

## Bug Fix (fix)

### Diagnosis
- "Found related code in {files}. Can you describe the expected vs. actual behavior?"
- "Is this a visual bug (styling), logic bug (state), or data bug (API response)?"

### Reproduction
- "Which browsers/devices does this occur on?"
- "Is this related to a specific state or user interaction sequence?"

### Type Safety
- "Could this be a TypeScript type mismatch? (any escaping strict mode, missing null check)"
- "Is the API response matching the expected Zod schema?"

### Scope
- "Should this fix include a regression test?"
- "Found similar patterns in {other_components}. Should we check for the same issue?"

## Refactoring (refactor)

### FSD Compliance
- "Found cross-slice imports: {imports}. Should we move shared code to entities or shared layer?"
- "Are there components in features/ that should be in shared/ui?"

### Component Patterns
- "Found inline styles or class concatenation. Should we convert to CVA + cn() pattern?"
- "Any prop drilling that should be replaced with state management?"

### Type Safety
- "Found `any` usage in {files}. Should we add proper types?"
- "Should we add Zod schemas for runtime validation at API boundaries?"

### Bundle
- "Found large imports in {file}. Should we add code splitting or lazy loading?"
- "Any barrel file re-exports causing unnecessary bundle inclusion?"

### Safety
- "Test coverage for {component}: how confident are we before refactoring?"
- "Are there other components depending on the current API (props interface)?"

## Performance (perf)

### Rendering
- "Found re-render issues? Should we add React.memo, useMemo, or useCallback?"
- "Any expensive computations that should be moved to a Web Worker?"

### Bundle Size
- "Current bundle size: {size}. Which dependencies are largest?"
- "Should we add dynamic imports for this feature? (React.lazy + Suspense)"

### Network
- "Are there API calls that could benefit from caching or deduplication?"
- "Should we prefetch data for likely next navigation?"

### Core Web Vitals
- "Which CWV metric is underperforming? (LCP, FID/INP, CLS)"
- "Found layout shifts in {component}. Should we add explicit dimensions?"

## Documentation (docs)

### Component Docs
- "Generate Storybook stories for new shared/ui components?"
- "Should we document the component props API?"

### Architecture
- "Document the FSD slice structure for this feature?"
- "Create an ADR for the state management decision?"
