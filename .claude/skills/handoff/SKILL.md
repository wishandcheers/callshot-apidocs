---
name: handoff
description: Save structured handoff document before /clear for seamless session continuation. Captures in-progress work, decisions, and pending tasks.
---

# Handoff Skill

## Usage
```
/handoff                   # Save current session state
/handoff "custom context"  # Save with additional context note
```

## When to Use
- Before `/clear` when work is in progress
- Long session approaching context limits
- Switching focus to a different task
- End of work session with unfinished tasks

## Process

### Step 1: Gather Context (Silent)
Collect information without outputting to user:

```bash
git branch --show-current
git status --short
git log -5 --oneline
git diff --stat
```

Also check:
- Existing `.claude/handoff.md` (previous handoff)
- `.claude/memories/` (recent memory files)

### Step 2: Draft Handoff Document
Based on conversation history + git data, draft the handoff document.

**Output template** (`.claude/handoff.md`):
```markdown
# Session Handoff
**Date**: YYYY-MM-DD
**Branch**: {current branch}
**Status**: {clean | N uncommitted changes}

## Goal
{What the user was trying to accomplish this session}

## Completed
- {What was finished}

## Key Decisions
- {Decision}: {rationale}

## Current State
{Where things stand right now — what's working, what's partially done}

## Open Issues
- {Blockers, errors, or unresolved questions}

## Pending Tasks
- [ ] {Next step 1}
- [ ] {Next step 2}

## Key Files
- `path/to/file` - {brief description of relevance}

## Notes
{Any additional context for the next session}
```

### Step 3: Confirm with User
Use **AskUserQuestion** to show the draft summary and ask:
- Is there anything to add or change?
- Options: "Looks good", "Add more context", "Edit pending tasks"

### Step 4: Write File
Write to `.claude/handoff.md` (overwrite if exists).

### Step 5: Output
```
Handoff saved: .claude/handoff.md

Next session, start with:
  "Read .claude/handoff.md and continue where we left off"
```

## Rules
- Always overwrite `.claude/handoff.md` (no date-versioned files)
- Keep under 80 lines
- File paths + brief description only (never include full file contents)
- Omit empty sections
- No sensitive information (secrets, tokens, passwords)
- Write in English for universal readability
