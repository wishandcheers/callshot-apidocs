---
name: pr-create
description: Create PR with comprehensive description for frontend projects. Delegates diff analysis to subagent.
---

# PR Creation Skill

## Usage
```
/pr-create                 # Create PR from current branch
/pr-create --draft         # Create as draft
```

## Process

### Step 1: Verify & Push
```bash
git branch --show-current
git push -u origin $(git branch --show-current)
```

### Step 2: Delegate Analysis to Subagent
Use Task tool:

```
Task: Analyze branch changes for PR description
Agent: typescript-code-reviewer
Prompt: |
  1. Run `git log origin/develop..HEAD --oneline`
  2. Run `git diff origin/develop --stat`
  3. Return ONLY:
     - Summary: 1-2 sentences
     - Changes: bullet list
     - Type: feature/bugfix/refactor/etc
     - FSD layers affected: shared/entities/features/widgets/pages
     - Has new components: yes/no
     - Has API changes: yes/no
     - Test coverage: adequate/needs-more
     - Bundle impact: none/minor/significant
```

### Step 3: Create PR
Using analysis result:

```bash
gh pr create \
  --title "<type>(<scope>): <description>" \
  --body "$(cat <<'EOF'
## Summary
{from subagent}

## Changes
{from subagent}

## Checklist
- [ ] FSD architecture compliant
- [ ] TypeScript strict mode passes
- [ ] Tests added/updated
- [ ] Accessibility checked
- [ ] No sensitive data exposed
EOF
)"
```

## Templates
See [references/templates.md](references/templates.md) for:
- Full PR body templates
- Component change sections
- API change sections
- Performance impact sections
