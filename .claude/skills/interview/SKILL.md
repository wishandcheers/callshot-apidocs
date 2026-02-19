---
name: interview
description: Structured requirements gathering. Scans codebase, interviews user, generates execution plan, delegates to agents on approval.
---

# Interview Skill

## Usage
```
/interview <brief description of what you want to build/fix/change>
```

## Process Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERVIEW FLOW                         │
│                                                             │
│  Phase 1        Phase 2         Phase 3        Phase 4      │
│  Context ──────▶ Interview ────▶ Plan ────────▶ Execute     │
│  Scan            (1-3 rounds)    Summary        (Agents)    │
│  (silent)        AskUser         Approve?       Task tool   │
│                                  ┌─ Yes ──▶ Go              │
│                                  ├─ Revise ──▶ Phase 2      │
│                                  └─ Cancel ──▶ Stop         │
└─────────────────────────────────────────────────────────────┘
```

## Available Agents

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

## Phase 1: Context Scan (Silent)

Before asking any questions, silently scan the codebase:

1. **Glob**: Find files related to user's description (by name patterns)
2. **Grep**: Search for relevant code patterns, existing implementations
3. **Read**: Skim key files (entry points, configs, related modules)

Collect:
- Existing FSD layer structure (features, entities, shared/ui)
- Related slices and components
- Current routing, state management, and API patterns
- CVA variants, Tailwind config, and design tokens

**Do NOT output scan results to the user. Use them to inform Phase 2 questions.**

## Phase 2: Interview (1-3 Rounds)

Use `AskUserQuestion` tool to gather requirements. Rules:

1. **Max 3 rounds** of questions. Auto-advance to Phase 3 when:
   - All critical decisions are resolved, OR
   - 3 rounds completed
2. **Max 4 questions per round** (AskUserQuestion limit)
3. **Always show what you found** in Phase 1 as context before asking
4. **Provide concrete options** with recommendations, not open-ended questions
5. **Early exit**: If the request is simple and Phase 1 gives enough context, skip to Phase 3 after 1 round

### Question Selection

Read [references/question-bank.md](references/question-bank.md) and select questions based on:
- Request type (feat/fix/refactor/perf/docs)
- What Phase 1 scan revealed
- What information is still missing for a complete plan

## Phase 3: Plan Summary

Generate a structured plan using [references/plan-template.md](references/plan-template.md).

Present the plan to the user with `AskUserQuestion`:

```
question: "Review the execution plan above. How would you like to proceed?"
options:
  - label: "Approve"
    description: "Execute the plan as described"
  - label: "Revise"
    description: "Go back and adjust requirements"
  - label: "Cancel"
    description: "Abort without executing"
```

- **Approve** → Phase 4
- **Revise** → Back to Phase 2 (1 more round only)
- **Cancel** → End skill

## Phase 4: Execute

Launch agents per the approved plan using the `Task` tool:

1. **Parallel steps**: Launch independent agents simultaneously
2. **Sequential steps**: Wait for dependencies before launching next
3. **Model selection**: Use the model specified in the plan table
4. **Integration**: After all agents complete, integrate outputs into final implementation

```
Task(
  subagent_type: "general-purpose",
  prompt: "Read @agents/{agent-name}.md and apply it to: {specific task from plan}",
  model: "{model from plan}"
)
```
