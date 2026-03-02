# Project Configuration

## Project Overview

- **Project Name**: callshot-apidocs
- **Description**: OpenAPI documentation viewer with versioned spec management, diff comparison, and changelog tracking
- **Repository**: https://github.com/wishandcheers/callshot-apidocs.git

## Clarify Before Action (REQUIRED)

**Flow**: Request → Light Analysis → Clarify (if needed) → Deep Analysis/Agents → Integrate → Respond

### Step 1: Light Analysis First
Before asking questions, quickly analyze:
- If `.claude/domain/graph.yaml` exists, read it first for entity/relationship overview
- Scan relevant FSD slices and components
- Check existing patterns (CVA, hooks, stores)
- Identify concrete implementation options

### Step 2: Ask with Context (Use AskUserQuestion)
When clarification needed, provide:
1. **Summary**: "Found existing auth feature with Zod validation pattern"
2. **Options**: Present 2-3 concrete choices with trade-offs
3. **Recommendation**: Mark preferred option with reasoning
4. **Specific question**: Not open-ended

### When to Ask
- Multiple valid approaches (new slice vs extend existing)
- FSD layer placement unclear
- State management strategy decision
- Component API design choices
- Breaking changes to existing components

### Example
```
Bad: "How should I implement the search?"

Good: "Found existing features/search with API integration.
   For autocomplete:
   1. Extend features/search (Recommended) - Reuse existing API client
   2. New features/autocomplete - Clean separation but duplicate API setup
   Which approach?"
```

**Better results come from precise requirements. Analyze first, then ask specifically.**

## Agent Orchestration (REQUIRED)

**Divide and Conquer**: For complex requests, decompose into parallel subtasks using specialist agents.

### Pattern
```
Request → Analyze → Parallel Task tools → Integrate → Respond
```

### Specialist Agents

| Agent | Use When | Model |
|-------|----------|-------|
| `fsd-architect` | New feature/page, package structure, layer design | opus |
| `ui-component-reviewer` | shared/ui component creation/modification | sonnet |
| `typescript-code-reviewer` | Code review, PR prep, type safety | sonnet |
| `frontend-debugger` | Test failures, build errors, runtime issues | sonnet |
| `vitest-runner` | Test execution, coverage analysis | haiku |
| `frontend-pr-reviewer` | PR review, diff analysis | sonnet |
| `a11y-auditor` | UI component a11y compliance | sonnet |
| `frontend-performance-engineer` | Bundle analysis, CWV, rendering optimization | sonnet |
| `domain-scanner` | Codebase scan → domain knowledge generation | sonnet |
| `domain-updater` | Incremental domain update after commit (additive only) | sonnet |

### How to Use

Launch via subagent with agent prompt file:

```
@"fsd-architect (agent)" "[specific task description]"
```

### When to Orchestrate

| Request Type | Agents to Launch (Parallel) |
|--------------|----------------------------|
| "Add {Feature}" | fsd-architect + a11y-auditor |
| "Create {Component}" | ui-component-reviewer + a11y-auditor |
| "Fix failing tests" | vitest-runner → frontend-debugger (sequential) |
| "Review this PR" | frontend-pr-reviewer |
| "Optimize performance" | frontend-performance-engineer |
| "Implement {page}" | fsd-architect + ui-component-reviewer |
| "Explain domain model" | `/domain` skill (no agent needed) |
| "Scan domain knowledge" | domain-scanner |
| `/commit` with domain changes | domain-updater (auto, background) |

### Execution Rules

1. **Parallel when independent**: Architecture + accessibility can run together
2. **Sequential when dependent**: Run tests → analyze failures (if any)
3. **Always integrate**: Combine agent outputs before responding — summarize key findings, resolve conflicts between agents, then implement
4. **Model selection**: Use specified model for cost/quality balance

### When NOT to Use Agents
- Simple edits (typo, rename, small config change) → direct work
- Single-file changes with clear scope → direct work
- Quick explanations or exploration → direct work
- Tasks needing iterative user dialogue → stay in main conversation

## Tech Stack

### Frontend
- **Language**: TypeScript (strict mode)
- **Framework**: React 19 + Vite 6 (SWC plugin)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + CVA + cn()
- **API Docs Renderer**: Redoc
- **Build Pipeline**: Vite build + spec generation scripts

### Key Libraries
- `redoc` + `styled-components` - OpenAPI spec rendering
- `react-router-dom` - Client-side routing
- `class-variance-authority` - Component variant management
- `clsx` + `tailwind-merge` - Class utility (cn())
- `lucide-react` - Icons
- `js-yaml` - YAML parsing (build scripts)

## Domain Knowledge

Use `/domain` to load pre-indexed business context. Eliminates full codebase scans for domain understanding.
- Graph + entity files in `.claude/domain/` | Run `/domain scan` to generate/update.

## Architecture

This project follows **Feature-Sliced Design (FSD) + Atomic Design (shared/ui)**.

> Detail: `rules/frontend/architecture.md` (auto-loaded)

## Component Patterns

> Detail: `rules/frontend/component-patterns.md` (auto-loaded)

## TypeScript Standards

> Detail: `rules/frontend/typescript.md` (auto-loaded)

## Testing Standards

> Detail: `rules/common/testing.md` (auto-loaded)

## Security Guidelines

> Detail: `rules/common/security.md` (auto-loaded)

## Git Workflow

> Detail: `rules/common/git.md` (auto-loaded)

## Memory Logging (REQUIRED)

Log significant work to `.claude/memories/` for context preservation.

### When to Log
- New feature/component added
- Architecture decisions
- Bug fixes (cause + solution)
- Config/build changes
- Dependency updates
- Performance optimizations

### Format
```
.claude/memories/YYYY-MM-DD_brief-title.md
```

See `rules/common/memory-logging.md` (auto-loaded) for details.

## Conditional Rules

Loaded automatically when editing matching files (`paths:` frontmatter):
- `rules/common/git.md` — git workflow (`.github/`, `.gitignore`, `CHANGELOG*`)
- `rules/common/testing.md` — testing standards (`*Test*`, `*Spec*`, `__tests__/`, `*.test.*`)
- `rules/common/security.md` — security guidelines (`security/`, `auth/`, `.env*`)
- `rules/frontend/architecture.md` — FSD architecture (`src/**/*.ts`, `src/**/*.tsx`, `src/**/*.vue`)
- `rules/frontend/component-patterns.md` — CVA + composition (`*.tsx`, `*.vue`, `components/`, `ui/`)
- `rules/frontend/typescript.md` — TypeScript strict mode (`*.ts`, `*.tsx`, `tsconfig*`)
- `rules/frontend/i18n.md` — internationalization (`*i18n*`, `*locale*`, `translations/`)
- `rules/frontend/storybook.md` — Storybook integration (`*.stories.*`, `.storybook/`)
- `rules/frontend/pwa.md` — PWA patterns (`manifest.json`, `service-worker*`)

## Project-Specific Conventions

### Directory Structure
```
src/
├── app/              # Routes definition (React Router)
├── pages/            # Page slices (FSD)
│   ├── dashboard/    # Overview — stats, timeline, recent changes
│   ├── reference/    # API reference — Redoc viewer + spec type tabs
│   ├── diff/         # Diff comparison — version picker, endpoint diffs
│   └── changelog/    # Changelog — version entries, filters
├── widgets/          # Layout composites
│   ├── app-shell/    # Root layout wrapper
│   ├── header/       # Top nav bar
│   └── sidebar/      # Side navigation
└── shared/           # Reusable infrastructure
    ├── ui/atoms/     # Badge, MethodBadge
    ├── lib/          # cn(), format(), api client
    ├── hooks/        # useVersions, useDiff, useChangelog, useTheme
    └── types/        # version, diff, changelog types

specs/                # Versioned OpenAPI specs (v0.2.1 … v0.9.1)
scripts/              # Build-time generators
├── generate-version-meta.mjs
├── generate-diffs.mjs
├── generate-versions-index.mjs
└── copy-specs-to-public.mjs
```

### Naming Conventions

| Component Type | Pattern | Example |
|----------------|---------|---------|
| Component | PascalCase | `LoginForm.tsx` |
| Hook | camelCase with `use` | `useAuth.ts` |
| Store | camelCase with `.store` | `auth.store.ts` |
| Types | camelCase with `.types` | `auth.types.ts` |
| API | camelCase with `.api` | `auth.api.ts` |
| Test | same name with `.test` | `LoginForm.test.tsx` |
| Story | same name with `.stories` | `Button.stories.tsx` |
| Utility | camelCase | `formatDate.ts` |
| Constant | UPPER_SNAKE_CASE | `API_BASE_URL` |

### Import Aliases
```typescript
// @ -> src/
import { Button } from '@/shared/ui/atoms';
import { useAuth } from '@/features/auth';
import { cn } from '@/shared/lib/cn';
```

### Environment Variables
```
VITE_BASE_PATH=/    # Base path for deployment (defaults to /)
```

## Critical Build Commands

```bash
# Development server
pnpm dev

# Build (generate specs + typecheck + vite build)
pnpm build

# Generate spec assets only
pnpm generate              # all generators
pnpm generate:specs        # copy specs to public/
pnpm generate:diffs        # compute version diffs
pnpm generate:meta         # version metadata
pnpm generate:index        # versions index

# Preview production build
pnpm preview
```

## Testing (REQUIRED)

**Always use the `/test` skill** to run tests. Do NOT run `npx vitest` directly via Bash.

- After writing or modifying code, invoke `/test` via the Skill tool to verify changes
- The `/test` skill provides: optimized output levels, automatic failure analysis (frontend-debugger), auto-fix & re-test loop (max 3 attempts)
- Specific test: `/test LoginForm.test.tsx`
- With coverage: `/test --coverage`
- Failed only: `/test --failed`

## Important Notes

1. **FSD Layer Rule**: Dependencies flow top-to-bottom only. Never import from higher layers.
2. **No any**: TypeScript strict mode is enforced. Use `unknown` with type guards instead.
3. **CVA Pattern**: All variant-based components must use CVA + cn() pattern.
4. **Accessibility**: All interactive components must be keyboard accessible with visible focus.
5. **Testing**: Use Testing Library queries by role/label. Avoid testId unless necessary.
6. **Token Storage**: Never store tokens in localStorage. Use httpOnly cookies or in-memory.
