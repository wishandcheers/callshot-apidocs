# Plan Output Template

## Format

After the interview, generate a plan using this structure:

```markdown
## Scope Summary
{1-3 sentence summary of what will be implemented}

## Steps

| # | Task | Agent | Model | Depends On |
|---|------|-------|-------|------------|
| 1 | {task description} | {agent-name} | {opus/sonnet/haiku} | - |
| 2 | {task description} | {agent-name} | {model} | 1 |
| 3 | {task description} | {agent-name} | {model} | 1 |

## Parallelization
- Steps {X, Y} can run in parallel (no dependencies)
- Step {Z} must wait for {X} to complete

## Files to Create/Modify
- `path/to/new-file.ext` (create)
- `path/to/existing-file.ext` (modify)

## Out of Scope
- {Explicitly excluded items from user conversation}

## Complexity Estimate
- **Size**: S / M / L / XL
- **Risk**: Low / Medium / High
- **Reason**: {1 sentence justification}
```

## Rules

- Every step MUST map to exactly one agent
- Use the cheapest sufficient model per step
- Maximize parallelization (independent steps should not depend on each other)
- Include "Out of Scope" to set clear boundaries
- Files list must be exhaustive (no surprise file creation during execution)
