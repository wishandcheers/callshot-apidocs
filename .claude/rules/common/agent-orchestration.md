# Agent Orchestration Protocol

**Divide and Conquer**: For complex requests, decompose into parallel subtasks using specialist agents.

## Pattern

```
Request → Analyze → Parallel Task tools → Integrate → Respond
```

## Execution Rules

1. **Parallel when independent**: Tasks that don't depend on each other's output can run together
2. **Sequential when dependent**: When one task needs another's output first (e.g., run tests → analyze failures)
3. **Always integrate**: Combine agent outputs before responding — summarize key findings, resolve conflicts between agents, then implement
4. **Model selection**: Use specified model for cost/quality balance

## When NOT to Use Agents

- Simple edits (typo, rename, small config change) → direct work
- Single-file changes with clear scope → direct work
- Quick explanations or exploration → direct work
- Tasks needing iterative user dialogue → stay in main conversation

## How to Use

Launch via agent invocation:

```
@"agent-name (agent)" "[specific task description]"
```
