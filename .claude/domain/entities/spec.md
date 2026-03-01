# Spec (OpenAPI Specification)

**Context**: documentation | **Type**: entity

## Definition
An OpenAPI 3.x specification file for a given version and spec type (api or admin).

## Structure
```
specs/:version/
├── apiDocs-api.json       # Public API spec
├── apiDocs-admin.json     # Admin/internal API spec
└── service-metadata.json  # Optional: generated_at timestamp
```

## Spec Types
| Type | File | Description |
|------|------|-------------|
| `api` | `apiDocs-api.json` | Public-facing API endpoints |
| `admin` | `apiDocs-admin.json` | Internal/admin API endpoints |

## Pipeline
1. **Source**: Raw specs in `specs/:version/`
2. **Build**: `scripts/copy-specs-to-public.mjs` copies to `public/data/specs/:version/`
3. **Runtime**: Redoc fetches from `/data/specs/:version/:fileName`

## UI
- `ApiReferencePage` renders spec via `RedocStandalone` (lazy-loaded)
- `SpecTypeTabs` switches between api/admin spec types
- Version selector dropdown navigates to `/reference/:version`

## Business Rules
- Redoc is lazy-loaded via `React.lazy()` for bundle optimization
- Redoc options are theme-aware (light/dark mode via `useTheme`)
- Component key includes `version + specType + theme` to force re-render on any change
