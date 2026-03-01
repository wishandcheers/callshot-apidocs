# Domain Knowledge Store

Structured domain knowledge for Claude Code. Reduces token waste by providing pre-indexed business context.

## Usage

```
/domain                     # Show entity graph overview
/domain <Entity>            # Show specific entity details
/domain <Entity1> <Entity2> # Show multiple entities
/domain <context-name>      # Show bounded context with all entities
/domain <workflow-name>     # Show workflow with related entities
/domain scan                # Scan codebase and regenerate domain files
```

## Structure

```
domain/
  graph.yaml       # Entity graph (adjacency list) - read this first
  glossary.md      # Ubiquitous language dictionary
  entities/        # Per-entity detail files
  contexts/        # Per-bounded-context summaries
  workflows/       # Cross-entity business process docs
```

## How It Works

1. `/domain scan` spawns the `domain-scanner` agent to analyze the codebase
2. Scanner writes structured files here based on FSD entity/feature patterns
3. `/domain <query>` reads only the relevant files (progressive disclosure)
4. `graph.yaml` serves as the index - Claude reads it first to navigate

## Regeneration

Run `/domain scan` after significant domain changes (new entities, API changes, type restructuring).
