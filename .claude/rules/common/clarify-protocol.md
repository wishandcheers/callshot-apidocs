# Clarify Before Action Protocol

**Flow**: Request → Light Analysis → Clarify (if needed) → Deep Analysis/Agents → Integrate → Respond

## Step 1: Light Analysis First

Before asking questions, quickly analyze:
- If `.claude/domain/graph.yaml` exists, read it first for entity/relationship overview
- Scan relevant files, modules, and packages
- Check existing patterns (architecture, naming, conventions)
- Identify concrete implementation options

## Step 2: Ask with Context (Use AskUserQuestion)

When clarification needed, provide:
1. **Summary**: What you found in the codebase ("Found X with Y pattern")
2. **Options**: Present 2-3 concrete choices with trade-offs
3. **Recommendation**: Mark preferred option with reasoning
4. **Specific question**: Not open-ended

**Better results come from precise requirements. Analyze first, then ask specifically.**
