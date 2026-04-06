---
name: memory-layer-1-tool-result-storage
description: "Layer 1: Large file tool outputs are persisted to disk, context only retains preview. Use when handling large file operations, Bash outputs exceeding threshold, or tool results that would bloat context."
---

# Memory Layer 1: Tool Result Storage

## When to Use This Skill

This skill activates when:
- File operations produce output > 8KB
- Bash commands generate large output
- Grep/Glob results exceed preview capacity
- Long-running tool executions need result persistence

## The Pattern

**Mechanism**: Large outputs are written to `.opencode/tool-results/<uuid>.txt`, context only keeps a 2KB preview.

**Implementation**:
```
1. Detect tool output exceeding threshold (default: 8192 bytes)
2. Write full output to .opencode/tool-results/<uuid>.txt
3. Replace context with preview (first 2KB wrapped in tag)
4. Model can use Read tool to access full result on demand
```

## OpenCode Tool

Use this skill by understanding the flow:

- **Threshold**: 8192 bytes (configurable)
- **Preview**: First 2048 bytes preserved in context
- **Storage location**: `.opencode/tool-results/`
- **File naming**: `<uuid>.txt` for deduplication

## Configuration

```json
{
  "tools": {
    "resultStorage": {
      "enabled": true,
      "threshold": 8192,
      "previewLength": 2048
    }
  }
}
```

## Why This Works

By persisting large results to disk, we avoid:
- Context bloat from repeated tool outputs
- Token waste on unchanged data
- API cache invalidation from large context shifts

The model receives enough preview to understand the result, with full access via Read tool when needed.

## Skill Activation

This skill is typically invoked automatically by the system when tool output exceeds threshold. You don't need to call it explicitly - it's part of the memory management system.
