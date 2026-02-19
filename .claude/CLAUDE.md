# Project Configuration

## Project Overview

- **Project Name**: [PROJECT_NAME]
- **Description**: [PROJECT_DESCRIPTION]
- **Repository**: [REPO_URL]

## Clarify Before Action (REQUIRED)

**Flow**: Request → Light Analysis → Clarify (if needed) → Deep Analysis/Agents → Integrate → Respond

### Step 1: Light Analysis First
Before asking questions, quickly analyze:
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

### How to Use

Launch via Task tool with `general-purpose` subagent + agent prompt:

```
Task(
  subagent_type: "general-purpose",
  prompt: "Read @agents/fsd-architect.md and apply it to: [specific task]",
  model: "opus"
)
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

### Execution Rules

1. **Parallel when independent**: Architecture + accessibility can run together
2. **Sequential when dependent**: Run tests → analyze failures (if any)
3. **Always integrate**: Combine agent outputs before final implementation
4. **Model selection**: Use specified model for cost/quality balance

## Tech Stack

### Frontend
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CVA (Class Variance Authority) + cn()
- **Testing**: Vitest + Testing Library + MSW
- **Validation**: Zod (runtime type validation)

### Key Libraries
- `class-variance-authority` - Component variant management
- `clsx` + `tailwind-merge` - Class utility (cn())
- `@testing-library/react` - Component testing
- `msw` - API mocking for tests
- `zod` - Schema validation

## Architecture

This project follows **Feature-Sliced Design (FSD) + Atomic Design (shared/ui)**.

@rules/frontend/architecture.md

## Component Patterns

@rules/frontend/component-patterns.md

## TypeScript Standards

@rules/frontend/typescript.md

## Testing Standards

@rules/common/testing.md

## Security Guidelines

@rules/common/security.md

## Git Workflow

@rules/common/git.md

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

See @rules/common/memory-logging.md for details.

## Optional Rules

Uncomment to include when project uses these technologies:

<!-- @rules/optional/storybook.md -->
<!-- @rules/optional/i18n.md -->
<!-- @rules/optional/pwa.md -->

## Project-Specific Conventions

### Directory Structure
```
src/
├── app/          # Initialization, providers, routing, global styles
├── pages/        # Route entry points
├── widgets/      # Large composite blocks (Header, Sidebar)
├── features/     # User interactions (auth, search, cart)
├── entities/     # Business entities (user, product)
└── shared/       # Reusable infrastructure
    ├── ui/       # Atomic Design (atoms/molecules/organisms)
    ├── lib/      # cn(), formatDate(), debounce()
    ├── api/      # API client, interceptors
    ├── config/   # Environment, constants
    ├── hooks/    # Shared custom hooks
    └── types/    # Shared type definitions
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
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

## Critical Build Commands

```bash
# Development server
pnpm dev

# Type checking
npx tsc --noEmit

# Build for production
pnpm build

# Run tests
npx vitest run

# Run tests with coverage
npx vitest run --coverage

# Lint
npx eslint src/

# Preview production build
pnpm preview
```

## Important Notes

1. **FSD Layer Rule**: Dependencies flow top-to-bottom only. Never import from higher layers.
2. **No any**: TypeScript strict mode is enforced. Use `unknown` with type guards instead.
3. **CVA Pattern**: All variant-based components must use CVA + cn() pattern.
4. **Accessibility**: All interactive components must be keyboard accessible with visible focus.
5. **Testing**: Use Testing Library queries by role/label. Avoid testId unless necessary.
6. **Token Storage**: Never store tokens in localStorage. Use httpOnly cookies or in-memory.
