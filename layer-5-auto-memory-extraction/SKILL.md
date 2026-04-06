---
name: memory-layer-5-auto-memory-extraction
description: "Layer 5: Extract high-value experiences to persistent memory. Use when you want to preserve user preferences, feedback, project knowledge, or patterns for future sessions."
---

# Memory Layer 5: Auto Memory Extraction

## When to Use This Skill

This skill activates when:
- User provides feedback or corrections
- Preferences become clear through behavior
- Project patterns emerge that should be remembered
- Knowledge is discovered that applies beyond current session

## The Pattern

**Mechanism**: Extract high-value experiences to persistent memory files.

## Memory Types

| Type | Description | Examples |
|------|-------------|----------|
| `preference` | User settings, tool preferences | "User prefers TypeScript" |
| `feedback` | Corrections, improvements | "Don't use mocks after incident X" |
| `knowledge` | Project/codebase knowledge | "API endpoint structure" |
| `pattern` | Recurring patterns | "Always use prepared statements" |

## Memory File Format

```yaml
---
name: testing-approach
description: User prefers integration tests over mocks after a prod incident
type: feedback
---

Integration tests must hit a real database, not mocks.

**Why:** Prior incident where mock/prod divergence masked a broken migration.
```

## Index File (MEMORY.md)

- Each entry ≤ 150 characters
- Hard limit: 200 lines OR 25KB
- Used for quick lookup during session start

```markdown
# Memory Index

## Preferences
- [[preference/testing-approach]] - Integration tests over mocks

## Feedback
- [[feedback/api-error-handling]] - Return structured errors

## Knowledge
- [[knowledge/project-structure]] - Monorepo with shared packages

## Patterns
- [[pattern/error-handling]] - Always log before throwing
```

## What NOT to Store

- Code patterns (derivable from code)
- Git history (use git directly)
- Debug solutions (in code)
- CLAUDE.md content (already persisted)
- Temporary task details (expires)

## Implementation

```
1. Detect high-value experience during conversation
2. Determine memory type (preference/feedback/knowledge/pattern)
3. Write to .opencode/memory/<type>/<name>.md
4. Update MEMORY.md index
5. Enforce line/size limits, prune if needed
```

## Configuration

```json
{
  "memory": {
    "autoMemory": {
      "enabled": true,
      "maxLines": 200,
      "maxSize": 25000
    }
  }
}
```

## Skill Activation

This skill can be invoked when you recognize valuable information:
> "This is useful information that should be remembered for future sessions."

Or automatically by the system when it detects patterns worth preserving.
