---
name: memory-layer-7-cross-agent-communication
description: "Layer 7: Communication and memory sharing between derived agents. Use when spawning subagents, need to share context between agents, or want to coordinate multi-agent workflows."
---

# Memory Layer 7: Cross-Agent Communication

## When to Use This Skill

This skill activates when:
- Spawning subagents for parallel work
- Need to share memory between agents
- Coordinating multi-agent workflows
- Passing context between parent and child agents

## The Pattern

**Mechanism**: Derived agents inherit parent context and can communicate.

## Derived Agent Model

When you spawn a subagent (via Task tool):
- Inherits **identical** system prompt
- Has **same** tools available
- Receives **same** message prefixes
- Shares **prompt cache** with parent (server recognizes identical prefixes)
- Gets **deep copy** of mutable state (prevents cross-contamination)

## Shared Memory Between Agents

| Shared | Not Shared |
|--------|------------|
| System prompt | Agent-local variables |
| Tool definitions | Session memory |
| Message history | Agent-specific state |
| Prompt cache | Execution state |

## SendMessage Tool

Agents can communicate directly:

```typescript
SendMessage({
  to: 'research-agent',  // Specific agent or '*' for broadcast
  message: 'Check Section 5',
  summary: 'Requesting section review'
})
```

## Message Flow

```
Parent Agent
    │
    ├──→ Research Agent ──→ SendMessage(summary) ──→ Parent
    │                                                    │
    ├──→ Code Agent ◄─────── SendMessage(results) ─────┘
    │
    └──→ Review Agent ◄──── SendMessage(feedback) ──────┘
```

## Implementation

```javascript
// When spawning agents
{
  inheritSystemPrompt: true,
  shareTools: true,
  messagePrefix: '<agent type="research">',
  deepCopyMutableState: true,
  sharedCacheKey: generateCacheKey(systemPrompt + tools)
}
```

## Why This Works

Cross-agent communication enables:
- **Parallel execution** - Multiple agents work simultaneously
- **Specialization** - Agents focus on different aspects
- **Coordination** - Results shared through messages
- **Efficiency** - Shared prompt cache reduces API calls

## Best Practices

1. **Clear message contracts** - Define expected message formats
2. **Use summaries** - Don't dump full results, summarize key points
3. **Broadcast sparingly** - Use `*` only when all agents need the info
4. **Handle failures** - Plan for agents that don't respond

## Skill Activation

This skill is automatically used when you spawn subagents. You invoke it explicitly when:
- Setting up multi-agent workflows
- Defining agent communication protocols
- Creating custom agent templates

Example invocation:
> "Spawn 3 parallel agents: one for research, one for implementation, one for review. Set up message passing between them."
