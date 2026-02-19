---
name: test
description: Run Vitest tests with optimized output. Use PROACTIVELY after writing or modifying code to verify changes. On failure, automatically analyzes and fixes issues, then re-tests until passing.
---

# Test Skill

## Usage
```
/test                      # Run all tests
/test <TestFile>           # Run specific test file
/test --path src/features/ # Run tests in specific directory
/test --failed             # Re-run failed tests only
/test --coverage           # Run with coverage report
```

## Process Overview

```
                    TEST LOOP

  Step 1: Run Tests (vitest-runner) ──┐
              │                        │
         PASS │              FAIL ─────┘
              │                │
              v                v
           Done         Step 2: Analyze
                        (frontend-debugger)
                              │
                              v
                        Step 3: Fix Code
                              │
                              v
                        Step 1: Re-test <── Loop
```

## Step 1: Run Tests (Subagent)

```
Task: Run Vitest tests with optimized output
Agent: vitest-runner
Prompt: |
  1. Run with minimal output:
     npx vitest run --reporter=dot 2>&1

  2. If FAILED:
     - Re-run failed tests with verbose:
       npx vitest run --reporter=verbose 2>&1
     - Return: FAILED + error details + failed test names

  3. If SUCCESS:
     - Return: PASSED + summary (count, duration)
```

## Step 2: On Failure - Analyze (Subagent)

If Step 1 returns FAILED:

```
Task: Analyze test failure and determine fix
Agent: frontend-debugger
Prompt: |
  Test failure details:
  {error_output_from_step1}

  1. Identify root cause:
     - Is it a code bug or test bug?
     - TypeScript type error?
     - Missing mock or setup?

  2. Locate the issue:
     - Which file/line needs fixing?
     - Read relevant source files

  3. Return:
     - Root cause (1-2 sentences)
     - File to fix: {path}
     - Suggested fix: {description}
```

## Step 3: Fix and Re-test

Based on frontend-debugger analysis:

1. Apply the suggested fix (Edit tool)
2. **Go back to Step 1** - re-run tests
3. Repeat until PASS (max 3 attempts)

## Output Format

**On Success (immediate or after fix):**
```
Tests PASSED
   - Total: 42 tests
   - Duration: 3.2s
```

**On Success (after fix loop):**
```
Tests PASSED (after 2 fix attempts)
   - Fixed: LoginForm missing mock provider
   - Total: 42 tests
   - Duration: 4.1s
```

**On Failure (max attempts reached):**
```
Tests still FAILING after 3 attempts

Last error:
{error_summary}

Manual intervention needed.
```

## Vitest Output Levels

| Reporter | Effect | When Used |
|----------|--------|-----------|
| `dot` | Minimal (dots) | First run |
| `verbose` | Full details | On failure |
| `json` | Machine-readable | CI/CD |

## Reference
See [references/patterns.md](references/patterns.md) for:
- Common test commands
- Debugging patterns
- MSW setup tips
