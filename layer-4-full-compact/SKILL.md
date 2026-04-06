---
name: memory-layer-4-full-compact
description: "Layer 4: Full context summarization with 9-block structure. Use when context exceeds threshold and session memory isn't available, or when you need to preserve key information through compression."
---

# Memory Layer 4: Full Compact

## When to Use This Skill

This skill activates when:
- Context exceeds token threshold
- Session memory compression is not available
- Need to preserve structured summary of entire conversation
- About to lose important information due to context limits

## The Pattern

**Mechanism**: Full summary generation with 9-block structured format.

**Trigger**: Context > threshold AND session memory compression unavailable

## Summary Structure (9 Blocks)

1. **Primary Request & Intent** - What the user asked for
2. **Key Technical Concepts** - Important ideas discussed
3. **Files & Code Sections** - Relevant code with snippets
4. **Errors & Fixes** - Problems encountered and solutions
5. **Problem Solving** - How challenges were addressed
6. **All User Messages** - Preserved verbatim
7. **Pending Tasks** - What's still to do
8. **Current Work** - Active task state
9. **Optional Next Steps** - Suggested follow-ups

## Post-Compression Recovery

The system preserves:
- Recent 5 files (5K token each)
- Invoked skills (5K token each)
- Plan attachments, deferred tools, MCP directives
- Re-executes SessionStart hooks

## Circuit Breaker

**Critical**: If full compact fails 3 times consecutively, the system triggers a circuit breaker:
- Auto-compaction disabled for current session
- Prevents infinite loop of failed compressions
- Allows manual intervention

## Configuration

```json
{
  "memory": {
    "autoCompact": {
      "enabled": true,
      "threshold": 140000,
      "retryLimit": 3
    }
  }
}
```

## Why This Works

Full compact is expensive but necessary when:
- No session memory to fall back on
- Context genuinely exceeded capacity
- Important information must be preserved

The circuit breaker prevents cascading failures.

## Skill Activation

This skill is invoked automatically by the system when context limits are reached. You don't call it directly - it's a last-resort memory management mechanism.
