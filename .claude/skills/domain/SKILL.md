---
name: domain
description: Load and navigate domain knowledge. Progressive disclosure - graph overview first, then entity/context/workflow details on demand.
---

# Domain Knowledge Skill

## Usage
```
/domain                     # Layer 1: graph overview
/domain <Entity>            # Layer 2: specific entity detail
/domain <Entity1> <Entity2> # Layer 2: multiple entities
/domain <context-name>      # Layer 3: bounded context + all entities
/domain <workflow-name>     # Layer 3: workflow + related entities
/domain scan                # Delegate to domain-scanner agent
```

## Process

### Step 1: Parse Arguments
- No args → Layer 1 (graph overview)
- `scan` → Step 4 (delegate to agent)
- Other args → Step 2 (resolve targets)

### Step 2: Load Graph
Read `.claude/domain/graph.yaml`. If empty/missing, suggest running `/domain scan`.

### Step 3: Resolve and Load Targets

**For entity names** (case-insensitive match against `entities` keys):
1. Show entity entry from graph.yaml (summary, relationships, rules)
2. Read entity detail file if it exists (`entities/<name>.md`)
3. Show related entities (1-hop neighbors from relationships)

**For context names** (match against `contexts` keys):
1. Show context description and aggregate list
2. Read context file if it exists (`contexts/<name>.md`)
3. Read all entity files for aggregates in this context
4. Show cross_rules involving these entities

**For workflow names** (match against `workflows` keys):
1. Show workflow description and entity list
2. Read workflow file if it exists (`workflows/<name>.md`)
3. Show entity summaries for all involved entities

**If no match found**: Fuzzy match against all entity/context/workflow names. Suggest closest matches.

### Step 4: Scan (Agent Delegation)
Spawn `domain-scanner` agent via Task tool:

```
Task: Scan codebase and generate/update domain knowledge files
Agent: domain-scanner
Model: sonnet
Prompt: |
  Scan this project's codebase and generate/update domain knowledge files
  in .claude/domain/. See .claude/skills/domain/references/scan-targets.md
  for scan patterns. Preserve any manual edits marked with comments.
```

## Rules
- Always read graph.yaml first before any entity/context files
- Show relationship graph context (neighbors) when loading individual entities
- Never load all entity files at once — only those requested or in scope
- If graph.yaml is empty, guide user to run `/domain scan` first
