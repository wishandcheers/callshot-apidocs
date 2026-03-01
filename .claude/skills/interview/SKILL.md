---
name: interview
description: Structured requirements gathering. Launches interviewer subagent for scanning/interview/planning, then executes approved plan via task agents.
---

# Interview Skill

## Usage
```
/interview <brief description of what you want to build/fix/change>
```

## Process Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                       INTERVIEW FLOW                              │
│                                                                   │
│  Main Agent                         Subagent (interviewer)        │
│  ──────────                         ──────────────────────        │
│  1. Launch ───────────────────────▶ Phase 1: Context Scan         │
│                                     Phase 2: Generate Questions   │
│  2. Receive questions ◀──────────── Return questions              │
│  3. AskUserQuestion (forward)                                     │
│  4. Resume with answers ──────────▶ Phase 3: Plan Generation      │
│  5. Receive plan ◀────────────────── Return plan text             │
│  6. Present plan → Approve?                                       │
│     ├─ Approve → 5a Research ∥ 5b Execute → 5c Integrate          │
│     ├─ Revise  → 1 follow-up round → re-present                  │
│     └─ Cancel  → stop                                             │
└──────────────────────────────────────────────────────────────────┘
```

## Step 1: Launch Interviewer Subagent (Scan + Questions)

Launch the `interviewer` agent for Phase 1 scan and question generation only:

```
Agent(
  subagent_type: "interviewer",
  prompt: "Read @agents/interviewer.md for context.

YOUR TASK: Execute Phase 1 (codebase scan) and Phase 2 (generate interview questions) ONLY.

User request: {user's description}

IMPORTANT: After scanning, return interview questions as a JSON code block tagged interview-questions. Do NOT generate a plan. Do NOT answer your own questions. STOP after returning the questions.",
  model: "opus"
)
```

The subagent returns structured interview questions. **Save the agent ID** from the result for Step 3.

## Step 2: Forward Questions to User

Parse the questions from the subagent output and call `AskUserQuestion` to forward them to the user. Preserve the subagent's question structure (question text, headers, options, multiSelect) when forwarding.

## Step 3: Resume Subagent with Answers

Resume the interviewer subagent with the user's answers to generate the plan:

```
Agent(
  resume: "{agent ID from Step 1}",
  prompt: "User answers to interview questions:\n{formatted answers from Step 2}\n\nProceed to Phase 3: generate the execution plan."
)
```

The subagent retains its full Phase 1 scan context and generates a plan informed by both scan results and user answers.

## Step 4: Present Plan for Approval

Display the returned plan to the user, then ask:

```
AskUserQuestion:
  question: "Review the execution plan above. How would you like to proceed?"
  options:
    - label: "Approve"
      description: "Execute the plan as described"
    - label: "Revise"
      description: "Adjust the plan (1 follow-up round)"
    - label: "Cancel"
      description: "Abort without executing"
```

### On Revise
Handle revision directly in the main agent (no subagent re-launch):
1. Ask 1 follow-up round via `AskUserQuestion` to clarify what to change
2. Update the plan based on responses
3. Re-present for approval

### On Cancel
End the skill.

## Step 5: Execute (Phase 4)

On **Approve**, execute the plan in 3 sub-steps. **The main agent acts as orchestrator only** — do NOT directly Read source files or Edit/Write code during execution.

### 5a: Pre-execution Research (Parallel)

For each step group (parallel batch), launch Explore agents to pre-fetch context **simultaneously**:

```
Agent(
  subagent_type: "Explore",
  prompt: "very thorough

Analyze these files for an upcoming code change:
Task context: {task description from Steps table}
Files: {list of file paths for this step}

For each file, return:
1. Full path, total lines, package/module
2. Key structures (classes, interfaces, functions) with line numbers
3. Import statements relevant to the task
4. The exact code sections that will need modification — quote them with line numbers
5. Dependencies: what other files/types are referenced

Be precise — an execution agent will use this to make targeted edits.",
  model: "haiku"
)
```

**Rules:**
- Launch ALL Explore agents for a parallel batch in a **single message** (maximizes parallelism)
- For sequential steps, launch research for the NEXT step while the current step executes (pipeline)
- Skip research for trivial steps (new file creation with no existing code to read)

### 5b: Execution (Dispatch to Task Agents)

For each step, dispatch a task agent with research context included:

```
Agent(
  subagent_type: "general-purpose",
  prompt: "Read @agents/{agent-name}.md and execute this task:

Task: {task description from Steps table}
Files: {relevant paths from 'Files to Create/Modify' section}
Prior steps completed: {outcomes of dependency steps, or 'none' if first step}

Code context (pre-analyzed):
{research output from 5a — paste the Explore agent's full response}",
  model: "{model from plan}"
)
```

**Prompt construction rules:**
- **Task**: Copy the exact task description from the plan's Steps table
- **Files**: Extract paths from "Files to Create/Modify" that relate to this step
- **Prior steps**: Summarize outputs of completed dependency steps (helps sequential agents build on prior work)
- **Code context**: Paste the Explore agent's analysis for this step's files. This gives the execution agent a precise map of what to read and where to edit, reducing exploratory tool calls

**Execution rules:**
- **Parallel steps**: Launch independent agents in a single message
- **Sequential steps**: Wait for dependency to complete, then launch next
- **Model selection**: Use the model specified in the plan table

### 5c: Integration

After all task agents complete:

1. **Review**: Read agent outputs and verify they addressed the task
2. **Build/Test**: Run build or test commands to verify correctness
3. **Fix**: If build fails, dispatch a follow-up agent with the error context
4. **Summary**: Report results to user with per-step outcomes

**The main agent may Read files and run Bash commands in this phase** (for verification only, not implementation).
