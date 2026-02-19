---
name: pr-review
description: Review PR with frontend architecture awareness. Delegates heavy analysis to frontend-pr-reviewer agent.
---

# PR Review Skill

## Usage
```
/pr-review <PR-URL>
/pr-review <PR-number>
/pr-review              # Current branch's PR
```

## Process

### Step 1: Fetch PR Info
```bash
gh pr view <number> --json title,body,files
```

### Step 2: Delegate Full Review to Subagent
Use Task tool for comprehensive analysis:

```
Task: Full PR review with architecture compliance
Agent: frontend-pr-reviewer
Prompt: |
  Review PR #{number}

  1. Run `gh pr diff {number}` to get changes
  2. Analyze each file for:
     - FSD architecture compliance (layer deps, slice isolation)
     - TypeScript quality (strict mode, no any)
     - Component patterns (CVA, cn(), composition)
     - Accessibility (semantic HTML, ARIA, keyboard)
     - Testing (Testing Library, MSW)
     - Performance (bundle impact, re-renders)
  3. Return structured review with:
     - Summary (2-3 sentences)
     - Architecture: PASS/WARN/FAIL
     - TypeScript: PASS/WARN/FAIL
     - Components: PASS/WARN/FAIL
     - Accessibility: PASS/WARN/FAIL
     - Testing: PASS/WARN/FAIL
     - Performance: PASS/WARN/FAIL
     - Issues table (severity, location, description)
     - Verdict: Approve/Request Changes
```

### Step 3: Format Output
Present subagent's review to user with:
- Clear verdict
- Prioritized issues
- Actionable feedback

## Checklist Reference
See [references/checklist.md](references/checklist.md) for:
- FSD architecture checks
- TypeScript quality checks
- Component pattern checks
- Accessibility requirements
- Testing requirements
