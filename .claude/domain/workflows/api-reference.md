# API Reference Workflow

## Description
User browses the full OpenAPI documentation for a selected version and spec type, rendered via Redoc.

## Flow
```
1. User navigates to /reference (or /reference/:version)
2. useVersions() loads VersionManifest for version list
3. If no version param → auto-redirect to latest version
4. Version selector dropdown + SpecTypeTabs render
5. User selects version and spec type (api/admin)
6. specUrl computed: /data/specs/:version/apiDocs-{type}.json
7. RedocStandalone (lazy-loaded) renders the OpenAPI spec
8. On version/type/theme change → full Redoc re-render via key change
```

## Components
| Component | File | Role |
|-----------|------|------|
| ApiReferencePage | `pages/reference/ui/ApiReferencePage.tsx` | Page with version/type controls + Redoc |
| SpecTypeTabs | `pages/reference/ui/SpecTypeTabs.tsx` | Api/admin tab switcher |

## Routes
- `/reference` — auto-redirects to latest version
- `/reference/:version` — specific version documentation
