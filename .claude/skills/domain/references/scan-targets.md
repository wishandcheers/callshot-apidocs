# Domain Scanner Targets: TypeScript/React + FSD Architecture

## Entity Discovery

### FSD Entity Types (Primary Source)
```
src/entities/*/model/types.ts
src/entities/*/model/*.ts
```
- Extract: type/interface definitions, Zod schemas
- Map to: entity name, fields, validation rules
- Look for: `z.object()`, `type`, `interface`, branded types

### Shared Domain Types
```
src/shared/types/*.ts
```
- Extract: shared type definitions used across entities
- Look for: common enums, utility types, API response types

### API Schemas (Runtime Source)
```
src/entities/*/api/*.ts
src/shared/api/*.ts
```
- Extract: API endpoint definitions, request/response types
- Infer relationships from nested response types
- Look for: fetch calls, query keys, mutation functions

## Relationship Discovery

### Entity Cross-References
```
src/entities/*/model/types.ts
```
- Extract: type fields referencing other entity IDs (e.g., `userId: UserId`)
- Extract: nested type references (e.g., `items: OrderItem[]`)
- Map to: relationships with type (1:1, 1:N, N:1)

### Feature Compositions
```
src/features/*/model/*.ts
src/widgets/*/model/*.ts
```
- Extract: imports from multiple entities → implies entity relationships
- Features combining entities indicate business process links

## Business Rule Discovery

### Zod Validation Schemas
```
src/entities/*/model/*.ts
src/features/*/model/*.ts
```
- Extract: `.min()`, `.max()`, `.regex()`, `.refine()` → field-level rules
- Extract: `.superRefine()` → cross-field validation rules
- Extract: custom refinements → business rules

### Feature Logic
```
src/features/*/model/*.ts
src/features/*/lib/*.ts
```
- Extract: business logic functions, state machines
- Extract: conditional rendering logic → UI-driven rules
- Look for: status enums, permission checks, workflow states

## Context Boundaries

### FSD Entities Layer = Context Hint
```
src/entities/*/
```
- Each entity slice = potential domain concept
- Grouping by shared API endpoints or data dependencies = bounded context

### Feature Groupings
```
src/features/*/
```
- Features importing from same entities = same context
- Feature names suggest business process groupings

## Output Mapping

| Source | Maps To |
|--------|---------|
| `entities/*/model/types.ts` | `entities/<name>.md` |
| Entity groupings by API/data | `contexts/<name>.md` |
| Multi-entity features | `workflows/<name>.md` |
| Type cross-references (IDs) | `graph.yaml` relationships |
| Zod schema constraints | `graph.yaml` rules |
| Type/interface names | `glossary.md` terms |
