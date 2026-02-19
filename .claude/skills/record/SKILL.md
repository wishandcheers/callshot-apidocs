---
name: record
description: Record significant work to .claude/memories/ for context preservation across sessions. Can be called manually or triggered by /commit.
---

# Record Skill

## Usage
```
/record                    # Record current session's work
/record "custom title"     # Record with custom title
```

## When to Record
- New feature/component implementation
- Bug fix with root cause analysis
- Architecture decisions
- Complex debugging sessions
- Integration with external services
- Performance optimizations

## Process

### Step 1: Gather Context
Collect information about recent work:
- Recent commits (if any): `git log -3 --oneline`
- Modified files: `git diff --name-only HEAD~1` or staged files
- Key decisions made during session

### Step 2: Generate Memory File

**Filename format:**
```
.claude/memories/YYYY-MM-DD_{brief-title}.md
```

**Content template:**
```markdown
# {Title}

**Date**: YYYY-MM-DD
**Type**: feat | fix | refactor | debug | architecture
**Commit**: {hash} (if applicable)

## Summary
{1-2 sentence description of what was done}

## Key Changes
- {change 1}
- {change 2}

## Decisions Made
- {decision 1}: {rationale}
- {decision 2}: {rationale}

## Files Affected
- `path/to/file1` - {what changed}
- `path/to/file2` - {what changed}

## Notes for Future
{Any context that would help future sessions}
```

### Step 3: Write File
Use Write tool to create the memory file.

## Output
```
Memory recorded: .claude/memories/2026-02-01_add-auth-feature.md
```

## Examples

### Feature Memory
```markdown
# Add Search Feature with Debounced Input

**Date**: 2026-02-01
**Type**: feat
**Commit**: a1b2c3d

## Summary
Implemented search feature with debounced input and API integration.

## Key Changes
- features/search/ui/SearchBar.tsx (CVA component)
- features/search/model/search.store.ts (state management)
- features/search/api/search.api.ts (MSW-mocked API)

## Decisions Made
- 300ms debounce: balance between responsiveness and API load
- Client-side filtering for < 100 results, API for more
- Used @tanstack/react-query for caching

## Files Affected
- `src/features/search/` - entire slice created
- `src/shared/lib/debounce.ts` - new utility

## Notes for Future
Consider adding search suggestions dropdown in next sprint.
```

### Debug Memory
```markdown
# Fix Hydration Mismatch in UserAvatar

**Date**: 2026-02-02
**Type**: fix
**Commit**: d4e5f6g

## Summary
Resolved hydration mismatch caused by Date.now() in server render.

## Root Cause
UserAvatar used Date.now() for cache-busting query param,
producing different values on server vs client.

## Solution
Moved cache-busting to useEffect (client-only).

## Files Affected
- `src/entities/user/ui/UserAvatar.tsx` - fixed rendering

## Notes for Future
Avoid non-deterministic values in SSR render path.
```
