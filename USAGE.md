# 记忆系统技能使用指南

## 概述

本指南提供了记忆系统技能的详细使用示例和最佳实践，帮助用户充分利用基于 Claude Code 7 层记忆架构的记忆管理系统。

## 快速开始

### 加载主技能

```bash
skill(name="memory-system")
```

### 加载特定层级

```bash
# 会话记忆 - 多轮任务时使用
skill(name="memory-layer-3-session-memory")

# 梦境 - 检查长期记忆
skill(name="memory-layer-6-dream")
```

## 各层级使用示例

### Layer 1: 工具结果存储

**功能**：将大于 8KB 的工具输出存储到磁盘，上下文仅保留预览。

**使用场景**：
- 处理大型文件
- 执行产生大量输出的 Bash 命令
- 搜索结果过多时

**配置示例**：

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

**最佳实践**：
- 对于预期会产生大量输出的命令，提前设置合理的阈值
- 利用预览功能快速了解结果，必要时使用 Read 工具获取完整内容
- 定期清理过期的工具结果文件

### Layer 2: 微压缩

**功能**：轻量级上下文清理，不生成摘要，保留提示词缓存。

**使用场景**：
- 空闲时间较长后清理上下文
- 清理旧的工具结果以释放令牌
- 保持上下文整洁而不影响提示词缓存

**配置示例**：

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

**最佳实践**：
- 根据实际使用情况调整空闲超时时间
- 了解哪些工具会被清理，哪些会被保留
- 在重要操作前手动触发微压缩以确保上下文整洁

### Layer 3: 会话记忆

**功能**：在对话期间维护实时笔记，在上下文压缩时保留下关键信息。

**使用场景**：
- 多轮复杂任务
- 需要跨会话保留信息的场景
- 跟踪项目进展和问题解决方案

**配置示例**：

```json
{
  "memory": {
    "sessionMemory": {
      "enabled": true,
      "updateThreshold": 4096,
      "toolCallThreshold": 10
    }
  }
}
```

**使用示例**：

```bash
# 手动触发会话记忆更新
skill(name="memory-layer-3-session-memory")

# 或者通过自然语言触发
"Let me update the session memory"
"Save my current state"
```

**最佳实践**：
- 在关键任务节点手动更新会话记忆
- 保持会话记忆文件的结构清晰
- 定期回顾会话记忆以了解项目进展

### Layer 4: 全量压缩

**功能**：完整上下文摘要，包含 9 大区块。

**使用场景**：
- 上下文超过令牌限制
- 会话记忆不可用时
- 需要保存完整对话历史的关键信息

**配置示例**：

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

**最佳实践**：
- 了解压缩后的摘要结构
- 确保重要信息在压缩前被明确标记
- 监控压缩失败情况，避免触发熔断机制

### Layer 5: 自动记忆提取

**功能**：将高价值经验提取到持久化记忆文件。

**使用场景**：
- 识别用户偏好
- 记录重要的反馈和纠正
- 提取项目知识和模式

**配置示例**：

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

**使用示例**：

```bash
# 手动触发记忆提取
skill(name="memory-layer-5-auto-memory-extraction")

# 或者通过自然语言触发
"This is useful information that should be remembered for future sessions."
```

**最佳实践**：
- 定期检查记忆文件和索引
- 保持记忆文件的格式规范
- 避免存储可从代码中推导的信息

### Layer 6: 梦境

**功能**：系统空闲时运行后台进程，回溯历史会话，优化长期记忆。

**使用场景**：
- 系统空闲时优化记忆
- 跨会话巩固知识
- 清理和重组记忆索引

**配置示例**：

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

**使用示例**：

```bash
# 手动触发梦境
skill(name="memory-layer-6-dream")

# 或者通过自然语言触发
"Run memory consolidation"
"Dream now"

# 检查记忆状态
"What's in my long-term memory?"
```

**最佳实践**：
- 在系统空闲时运行梦境
- 了解梦境的四阶段处理流程
- 监控梦境运行状态，确保其正常完成

### Layer 7: 跨 Agent 通信

**功能**：派生的 Agent 之间共享上下文和通信。

**使用场景**：
- 并行工作的子 Agent
- 需要共享记忆的多 Agent 系统
- 复杂工作流的协调

**使用示例**：

```javascript
// 派生 Agent
const subAgent = spawnAgent({
  name: "research-agent",
  systemPrompt: "You are a research specialist",
  tools: [...]
});

// 发送消息
SendMessage({
  to: "research-agent",
  message: "Check Section 5",
  summary: "Requesting section review"
});
```

**最佳实践**：
- 定义清晰的消息格式和协议
- 使用摘要而不是完整结果
- 谨慎使用广播功能
- 处理 Agent 无响应的情况

## 综合使用示例

### 复杂任务工作流

1. **初始化**：加载主记忆系统技能
2. **会话记忆**：在开始复杂任务前更新会话记忆
3. **工具结果**：处理大型文件时利用工具结果存储
4. **自动记忆**：识别并提取有价值的信息到长期记忆
5. **跨 Agent**：需要时派生专业子 Agent
6. **梦境**：任务完成后运行梦境巩固记忆

```bash
# 完整工作流示例
skill(name="memory-system")

# 开始任务
"Let me update the session memory with the current task"

# 处理大型文件
# 工具结果会自动存储

# 识别重要信息
"This approach is valuable, remember it for future projects"

# 派生子 Agent
"Spawn a research agent to investigate this issue"

# 任务完成
"Run memory consolidation to organize what we've learned"
```

## 配置最佳实践

### 基础配置（必选）

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

### 进阶配置（可选）

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
    },
    "microCompact": {
      "idleTimeoutMinutes": 60,
      "enabled": true
    },
    "tools": {
      "resultStorage": {
        "enabled": true,
        "threshold": 8192,
        "previewLength": 2048
      }
    }
  }
}
```

## 故障排除

### 常见问题

1. **工具结果未存储**
   - 检查配置是否启用了 resultStorage
   - 确认输出大小是否超过阈值
   - 检查磁盘空间是否充足

2. **会话记忆未更新**
   - 检查配置参数是否正确
   - 确认是否达到了更新阈值
   - 尝试手动触发更新

3. **压缩失败**
   - 检查熔断机制是否被触发
   - 确认 LLM 连接是否正常
   - 尝试减少上下文大小

4. **记忆提取不工作**
   - 检查记忆目录结构是否完整
   - 确认配置是否启用了 autoMemory
   - 检查索引文件大小是否超过限制

5. **梦境未运行**
   - 检查配置是否启用了 dream
   - 确认系统是否有足够的空闲时间
   - 检查锁文件是否存在导致阻塞

## 性能优化建议

1. **调整阈值**：根据实际使用情况调整各层级的阈值
2. **定期清理**：定期清理过期的工具结果和记忆文件
3. **合理使用**：只在必要时使用高成本的层级
4. **监控状态**：定期检查记忆系统的运行状态
5. **优化配置**：根据硬件和使用场景优化配置参数

## 总结

记忆系统技能提供了一个全面的记忆管理解决方案，通过 7 层架构从低到高成本递增的设计，为不同场景提供了合适的记忆管理策略。合理使用各层级功能，可以显著提高工作效率和系统性能。

通过本指南的使用示例和最佳实践，用户可以更好地理解和利用记忆系统技能，为复杂任务和长期项目提供可靠的记忆支持。