---
name: memory-system
description: "Claude Code 7-layer memory architecture adapted for OpenCode. Use when you need to understand or implement memory management, context compression, session persistence, or cross-session knowledge consolidation."
---

# Memory System - 7 Layer Architecture

> This skill implements Claude Code's 7-layer memory architecture, adapted for OpenCode.

## Overview

The memory system uses **defense in depth** - each layer prevents more expensive operations from triggering:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: Cross-Agent Communication                          │
│          ← Shared context between subagents                │
├─────────────────────────────────────────────────────────────┤
│ Layer 6: Dream (Cross-Session Consolidation)               │
│          ← Background memory optimization                  │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Auto Memory Extraction                            │
│          ← Persistent learning from sessions               │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Full Compact                                      │
│          ← Full context summarization                      │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Session Memory                                    │
│          ← Live notes during conversation                   │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Micro Compact                                      │
│          ← Lightweight cleanup without summaries           │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Tool Result Storage                               │
│          ← Large outputs to disk, preview in context        │
└─────────────────────────────────────────────────────────────┘
         ↑ Cost increases →
```

## Layer Details

### Layer 1: Tool Result Storage
**Cost**: Minimal (disk write + preview)
**When**: Large tool outputs exceed threshold

```markdown
- File: `.opencode/tool-results/<uuid>.txt`
- Preview: First 2KB in context
- Access: Read tool retrieves full content
```

→ See: `memory-layer-1-tool-result-storage`

### Layer 2: Micro Compact
**Cost**: Low (cache cleanup, no LLM)
**When**: Idle 60+ minutes, stale tool results

```markdown
- Cleans: FileRead, Bash, Grep, Glob, WebSearch, WebFetch
- Preserves: Thinking, messages, MCP results
- Mechanism: cache_edits (no prompt cache invalidation)
```

→ See: `memory-layer-2-micro-compact`

### Layer 3: Session Memory
**Cost**: Medium (incremental updates)
**When**: Token growth > threshold, multi-turn tasks

```markdown
- Template: Current State, Task Spec, Files, Workflow, Errors, Learnings
- Location: `.opencode/session-memory/<sessionId>.md`
- Survives: Context compression
```

→ See: `memory-layer-3-session-memory`

### Layer 4: Full Compact
**Cost**: High (LLM summarization)
**When**: Context exceeded, no session memory

```markdown
- Structure: 9-block summary
- Recovery: Recent files, skills, plan attachments
- Circuit breaker: 3 failures → disable auto-compact
```

→ See: `memory-layer-4-full-compact`

### Layer 5: Auto Memory Extraction
**Cost**: Medium (selective LLM calls)
**When**: User feedback, preferences, patterns detected

```markdown
- Types: preference, feedback, knowledge, pattern
- Location: `.opencode/memory/<type>/<name>.md`
- Index: MEMORY.md (200 lines / 25KB limit)
```

→ See: `memory-layer-5-auto-memory-extraction`

### Layer 6: Dream
**Cost**: Low (background processing)
**When**: System idle, periodic consolidation

```markdown
- Phases: Locate → Collect → Consolidate → Prune
- Constraints: Read-only Bash, memory path only Edit/Write
- Safety: Lock file, time limits
```

→ See: `memory-layer-6-dream`

### Layer 7: Cross-Agent Communication
**Cost**: Medium (coordination overhead)
**When**: Spawning subagents, multi-agent workflows

```markdown
- Inheritance: System prompt, tools, message prefixes
- Shared: Prompt cache, message history
- Communication: SendMessage tool
```

→ See: `memory-layer-7-cross-agent-communication`

## Design Principles

1. **Defense in depth**: Lower-cost layers prevent higher-cost triggers
2. **Prompt cache preservation**: Every decision considers cache impact
3. **Isolation + sharing**: Deep copy mutable state, share cache
4. **Circuit breakers**: Prevent cascading failures
5. **Graceful degradation**: Silent failures, smooth handoffs

## Configuration

### Basic (Recommended)

```json
{
  "memory": {
    "sessionMemory": {
      "enabled": true,
      "updateThreshold": 4096,
      "toolCallThreshold": 10
    },
    "autoCompact": {
      "enabled": true,
      "threshold": 140000,
      "retryLimit": 3
    }
  }
}
```

### Advanced (Optional)

```json
{
  "memory": {
    "autoMemory": {
      "enabled": true,
      "maxLines": 200,
      "maxSize": 25000
    },
    "dream": {
      "enabled": true,
      "interval": 3600000,
      "maxRuntime": 600000
    }
  }
}
```

## Quick Reference

| Trigger | Layer Invoked |
|---------|---------------|
| Large file read | L1: Tool Storage |
| Idle 60+ min | L2: Micro Compact |
| Multi-turn task | L3: Session Memory |
| Context overflow | L4: Full Compact |
| User feedback | L5: Memory Extraction |
| System idle | L6: Dream |
| Spawn subagent | L7: Cross-Agent |

## Related Documents

- [[Claude-Memory-Architecture-AGENTS.md]] - Full specification
- [[AI-Programming-System]] - OpenCode workflow
- [[OpenViking-Setup]] - Alternative memory system
