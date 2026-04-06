---
name: memory-layer-3-session-memory
description: "Layer 3: Maintains live session notes while working. Use when you need to preserve context across multiple turns, avoid losing progress when context compresses, or track complex multi-step tasks."
---

# Memory Layer 3: Session Memory

## When to Use This Skill

This skill activates when:
- Working on multi-step tasks across many turns
- Need to preserve current state for reference
- Context is growing and may trigger compression
- Want to avoid losing progress when compression happens
- Tracking files, functions, workflow, errors, learnings

## The Pattern

**Mechanism**: Maintain live session notes that survive context compression.

**Session Memory Template** (`.opencode/session-memory/<sessionId>.md`):
```markdown
# Session Title

# Current State
_What is actively being worked on right now?_

# Task specification
_What did the user ask to build?_

# Files and Functions
_Important files and their relevance_

# Workflow
_Bash commands usually run and their interpretation_

# Errors & Corrections
_Errors encountered and how they were fixed_

# Codebase and System Documentation
_Important system components and how they fit together_

# Learnings
_What has worked well? What has not?_

# Key results
_If the user asked for specific output, repeat it here_

# Worklog
_Step by step, what was attempted and done_
```

## Triggers

- Token growth > minimum update threshold
- AND (tool call count > threshold OR last round had no tool calls)

## Implementation

```
1. Detect token growth or tool call patterns
2. Update session memory with current state
3. Preserve key files, functions, errors, learnings
4. When full compact triggers, use session memory instead of regenerating
```

## Why This Works

Session memory compression is much cheaper than full compact because:
- Summary already prepared - no LLM generation needed
- Incremental updates only add new information
- Survives context compression by design
- Model can reference without regeneration

## Skill Activation

This skill can be invoked proactively by saying something like:
> "Let me update the session memory" or "Save my current state"

Or automatically when the system detects compression is imminent.
