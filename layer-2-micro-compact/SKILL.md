---
name: memory-layer-2-micro-compact
description: "Layer 2: Lightweight context cleanup without generating summaries. Use when context is filling with old tool results, after idle time, or when you need to free tokens without full compression."
---

# Memory Layer 2: Micro Compact

## When to Use This Skill

This skill activates when:
- Context has old tool results that can be cleaned
- Idle for 60+ minutes and want to clean up
- Using API's cache_edits mechanism to clean without invalidating prompt cache
- Need to free tokens quickly without full context compression

## The Pattern

**Mechanism**: Lightweight cleanup - no summary generation, just removes old tool results.

**Triggers**:
- **Time-based**: Idle > 60 minutes → clean old tool results
- **Cache-based**: Use `cache_edits` to clean without breaking prompt cache

**Cleanable Tools**:
- `FileRead` - Old file reads not currently needed
- `Bash` - Previous command outputs
- `Grep` - Old search results
- `Glob` - File listings no longer relevant
- `WebSearch` - Cached search results
- `WebFetch` - Old web content

**Exempt**:
- `Thinking` blocks
- Assistant messages
- User messages
- MCP tool results

## Implementation

```
1. Identify tools with results older than threshold
2. Check if results are referenced in recent conversation
3. Use cache_edits to remove from API cache
4. Free tokens without regenerating summary
```

## Configuration

```json
{
  "memory": {
    "microCompact": {
      "idleTimeoutMinutes": 60,
      "enabled": true
    }
  }
}
```

## Why This Works

Micro compact costs significantly less than full compression because:
- No LLM generation needed (just cleanup)
- Uses API's cache_edits to preserve prompt cache
- Removes only stale data, keeps context coherent

## Skill Activation

This skill is typically invoked automatically by the system when idle timeout is reached or cache cleanup is needed. You don't need to call it explicitly.
