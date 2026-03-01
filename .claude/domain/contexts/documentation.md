# Documentation Context

## Scope
API reference rendering — displays versioned OpenAPI specs via Redoc with version and spec type selection.

## Aggregates
- **Spec** — OpenAPI specification file (api or admin variant)

## Key Files
| File | Role |
|------|------|
| `src/pages/reference/ui/ApiReferencePage.tsx` | Main page: version selector + Redoc renderer |
| `src/pages/reference/ui/SpecTypeTabs.tsx` | Tab switcher between api/admin spec types |
| `scripts/copy-specs-to-public.mjs` | Build: copies specs from `specs/` to `public/data/specs/` |

## Data Flow
```
specs/:version/apiDocs-{api,admin}.json
  → copy-specs-to-public.mjs → public/data/specs/:version/apiDocs-{api,admin}.json
  → RedocStandalone specUrl="/data/specs/:version/apiDocs-{type}.json"
```

## Rendering Strategy
- Redoc is lazy-loaded (`React.lazy`) to reduce initial bundle size
- Theme-aware: light/dark options computed via `useTheme().resolved`
- Component key `${version}-${specType}-${theme}` forces full re-render on any param change

## Routes
- `/reference` — auto-redirects to latest version
- `/reference/:version` — renders spec for specific version
