---
name: commit
description: Create conventional commit for frontend projects. Delegates analysis to subagent for token efficiency. Triggers /record for significant changes.
---

# Git Commit Skill

## Usage
```
/commit                    # Auto-generate message
/commit -m "message"       # Custom message
```

## Process

### Step 1: Delegate Analysis to Subagent
Use Task tool to spawn analysis agent:

```
Task: Analyze staged changes for commit
Agent: typescript-code-reviewer (or general code-reviewer)
Prompt: |
  1. Run `git diff --staged --stat` for overview
  2. Run `git diff --staged` for details
  3. Return ONLY:
     - Type: feat/fix/refactor/test/chore/docs/perf/style
     - Scope: based on changed paths (ui, auth, form, etc.)
     - Summary: one-line description
     - Body: bullet points of changes (if needed)
     - FileCount: number of files changed
     - IsSignificant: true/false (see criteria below)
```

### Step 2: Generate Commit
Using subagent's analysis, create commit:

```bash
git commit -m "<type>(<scope>): <description>

<body if needed>"
```

### Step 3: Trigger Memory (Conditional)

**After successful commit**, evaluate if memory should be recorded:

#### Record Memory (Significant Work):
- Type is `feat` (new feature/component)
- Type is `fix` with root cause analysis
- Type is `refactor` with structural changes
- 5+ files changed
- New feature/entity/widget slice added
- Architecture decisions made
- New shared/ui component added

#### Skip Memory (Minor Work):
- Type is `chore` (deps, config tweaks)
- Type is `style` (formatting only)
- Type is `docs` (documentation only)
- Type is `test` (tests only, no feature)
- Single file change (usually)
- Typo fixes, minor adjustments

**If significant**: Call `/record` skill using Skill tool
```
Skill(skill: "record")
```

## Type/Scope Reference
See [references/conventions.md](references/conventions.md) for:
- Type selection guide
- Scope mapping for frontend
- Example messages

## Rules
- Do NOT add Co-Authored-By footer
- Keep subject under 50 chars
- Wrap body at 72 chars
- Memory is automatic for significant commits
