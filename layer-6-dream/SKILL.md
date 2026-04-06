---
name: memory-layer-6-dream
description: "Layer 6: Cross-session memory consolidation through background dreaming. Use when you want to optimize long-term memory, consolidate insights across sessions, or clean up stale memory entries."
---

# Memory Layer 6: Dream - Cross-Session Consolidation

## When to Use This Skill

This skill activates when:
- System idle or user away for extended period
- Want to optimize and consolidate long-term memory
- Need to review past sessions for pattern extraction
- Memory index needs cleanup and reorganization

## The Pattern

**Mechanism**: Background process that consolidates memories when system is idle.

## Four Dream Phases

### Phase 1: Locate
Read MEMORY.md to understand current memory index:
- What memories exist
- Types and distributions
- Last update timestamps

### Phase 2: Collect
- Review session logs from past period
- Check for drifted memories (outdated, contradictory)
- Execute targeted grep for specific knowledge
- Identify consolidation opportunities

### Phase 3: Consolidate
- Write/update memory files
- Merge related memories into unified entries
- Convert relative dates to absolute
- Update cross-references

### Phase 4: Prune
- Update MEMORY.md index
- Maintain 200 line / 25KB limit
- Remove stale pointers and orphaned entries
- Archive memories no longer relevant

## Tool Constraints During Dream

| Tool | Allowed? | Notes |
|------|----------|-------|
| `Bash` | Read-only only | ls, find, grep, cat, stat, wc, head, tail |
| `Edit/Write` | Memory paths only | Only .opencode/memory/ directory |
| MCP tools | No | Disabled during dream |
| Agent tools | No | No subagent spawning |
| Destructive | No | No rm -rf, only cleanup |

## Implementation

```javascript
// Dream runs as background process
{
  phase: "dream",
  enabled: true,
  interval: 3600000,      // 1 hour idle
  maxRuntime: 600000,    // 10 minutes max
  lockFile: ".opencode/.dream.lock"
}
```

## Configuration

```json
{
  "memory": {
    "dream": {
      "enabled": true,
      "interval": 3600000,
      "maxRuntime": 600000
    }
  }
}
```

## Why This Works

Dreaming mimics biological sleep memory consolidation:
- Offline processing doesn't interrupt user workflow
- Systematic review catches drift and inconsistency
- Periodic optimization prevents memory bloat
- Cross-session insights emerge from combined data

## Safety Mechanisms

- Lock file prevents concurrent dream processes
- Tool restrictions prevent unintended side effects
- Time limits prevent infinite loops
- Graceful degradation on errors

## Skill Activation

This skill runs automatically when system detects idle period. You can also trigger manually:
> "Run memory consolidation" or "Dream now"

Or check status:
> "What's in my long-term memory?"
