# Seven Memory - 7 层记忆系统技能包

> 基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路设计的兼容 OpenClaw 和 OpenCode 的技能集

## 概述

Seven Memory 是一套为 OpenClaw 和 OpenCode 设计的记忆管理系统，源自 Claude Code 的 7 层记忆架构和 Andrej Karpathy 用大模型和 Obsidian 打造个人本地知识库的思路。该架构的核心设计理念是：**用极低成本的浅层拦截，去规避算力高昂的深层压缩**。

## 鸣谢

- **Claude Code**: 提供了 7 层记忆架构的核心设计理念
- **Andrej Karpathy**: 启发了使用 Obsidian 构建个人知识库的思路

## 架构层级

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: 跨 Agent 通信                                       │
│          ← 子 Agent 之间的上下文共享                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 6: 梦境 (跨会话巩固)                                  │
│          ← 后台记忆优化与整合                                │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: 自动记忆提取                                       │
│          ← 从会话中持久化学习内容                            │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: 全量压缩                                           │
│          ← 完整上下文摘要                                    │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: 会话记忆                                           │
│          ← 对话期间的实时笔记                                │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: 微压缩                                             │
│          ← 轻量级清理，不生成摘要                            │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: 工具结果存储                                       │
│          ← 大输出写入磁盘，上下文仅保留预览                  │
└─────────────────────────────────────────────────────────────┘
         ↑ 成本增加 →
```

## 技能列表

### 主技能

| 技能名称 | 说明 |
|----------|------|
| `seven-memory` | 完整 7 层记忆架构总览与配置指南 |

### 各层技能

| 技能名称 | 层级 | 触发条件 |
|----------|------|----------|
| `memory-layer-1-tool-result-storage` | L1 | 大文件操作、超大 Bash 输出 |
| `memory-layer-2-micro-compact` | L2 | 空闲 60+ 分钟、清理旧工具结果 |
| `memory-layer-3-session-memory` | L3 | 多轮对话、复杂任务 |
| `memory-layer-4-full-compact` | L4 | 上下文溢出、无会话记忆可用 |
| `memory-layer-5-auto-memory-extraction` | L5 | 用户反馈、偏好、模式识别 |
| `memory-layer-6-dream` | L6 | 系统空闲、定期整合 |
| `memory-layer-7-cross-agent-communication` | L7 | 派生子 Agent、多 Agent 工作流 |

## 安装指南

### 系统要求

- Node.js 14.0 或更高版本
- Git
- Obsidian (推荐用于查看和管理记忆文件)
- OpenClaw (推荐作为技能载体)

### 安装步骤

#### OpenClaw 安装 (推荐)

1. 安装 OpenClaw CLI
   ```bash
   npm install -g openclaw-cli
   ```

2. 安装 Seven Memory 技能
   ```bash
   openclaw install seven-memory
   ```

3. 运行安装脚本（重要）
   ```bash
   cd ~/.openclaw/workspace/skills/seven-memory
   node install.js
   ```
   此步骤会：
   - 检查系统环境
   - 创建必要的目录结构
   - 配置记忆存储路径
   - 创建 AGENTS.md 规则文件
   - 验证安装

4. 初始化记忆目录
   ```bash
   openclaw run seven-memory:init
   ```

#### 手动安装

##### macOS/Linux

1. 克隆仓库
   ```bash
   git clone https://github.com/suana1979/seven-memory.git ~/.openclaw/skills/memory-system
   ```

2. 安装依赖
   ```bash
   cd ~/.openclaw/skills/memory-system
   npm install
   ```

3. 运行安装脚本（重要）
   ```bash
   node install.js
   ```
   此步骤会：
   - 检查系统环境
   - 创建必要的目录结构
   - 配置记忆存储路径
   - 创建 AGENTS.md 规则文件
   - 验证安装

4. 初始化记忆目录
   ```bash
   node init.js
   ```

##### Windows

1. 克隆仓库
   ```powershell
   git clone https://github.com/yourusername/seven-memory.git %USERPROFILE%\.openclaw\skills\memory-system
   ```

2. 安装依赖
   ```powershell
   cd %USERPROFILE%\.openclaw\skills\memory-system
   npm install
   ```

3. 运行安装脚本（重要）
   ```powershell
   node install.js
   ```
   此步骤会：
   - 检查系统环境
   - 创建必要的目录结构
   - 配置记忆存储路径
   - 创建 AGENTS.md 规则文件
   - 验证安装

4. 初始化记忆目录
   ```powershell
   node init.js
   ```

## 配置指南

### OpenClaw 默认配置

```yaml
# OpenClaw 配置文件
name: seven-memory
description: 7 层记忆系统技能包
author: Your Name
version: 1.0.0

# 定时任务配置
schedules:
  # 每天凌晨 2 点钟自动执行梦境功能
  - name: dream
    cron: "0 2 * * *"
    command: "node layer-6-dream/index.js"
    description: "每天凌晨 2 点执行记忆巩固"

# 记忆系统配置
config:
  memory:
    sessionMemory:
      enabled: true
      updateThreshold: 4096
      toolCallThreshold: 10
    autoCompact:
      enabled: true
      threshold: 140000
      retryLimit: 3
    autoMemory:
      enabled: true
      maxLines: 200
      maxSize: 25000
    dream:
      enabled: true
      interval: 3600000
      maxRuntime: 600000
    microCompact:
      idleTimeoutMinutes: 60
      enabled: true
    storage:
      rawMemoryPath: "/Users/suana/Documents/Obsidian Vault/raw"
      processedMemoryPath: "/Users/suana/Documents/Obsidian Vault/_wiki"
      agentsGuidePath: "/Users/suana/Documents/Obsidian Vault/_wiki/AGENTS.md"
  tools:
    resultStorage:
      enabled: true
      threshold: 8192
      previewLength: 2048
  llm:
    provider: "default"
    apiKey: ""
    model: ""
```

### 自定义配置

#### 1. 自定义记忆存储位置

```yaml
config:
  memory:
    storage:
      rawMemoryPath: "path/to/your/raw/memory"
      processedMemoryPath: "path/to/your/processed/memory"
      agentsGuidePath: "path/to/your/AGENTS.md"
```

#### 2. 自定义大模型

```yaml
config:
  llm:
    provider: "openai"
    apiKey: "your-api-key"
    model: "gpt-4o"
```

#### 3. 自定义梦境启动时间

```yaml
# 每天凌晨 3 点钟执行
 schedules:
  - name: dream
    cron: "0 3 * * *"
    command: "node layer-6-dream/index.js"
    description: "每天凌晨 3 点执行记忆巩固"
```

## 目录结构

### 默认目录结构

```
/Users/suana/Documents/Obsidian Vault/
├── raw/                # 原始记忆存储
└── _wiki/
    ├── AGENTS.md       # 记忆整理指引
    └── ...              # 整理后的记忆文件
```

### 记忆文件格式

#### 原始记忆文件

```yaml
---
name: memory-name
description: Brief description of the memory
type: preference|feedback|knowledge|pattern
date: 2026-04-06T12:00:00Z
---

Memory content here...

**Why:** Reason for remembering this...
```

#### AGENTS.md 指引文件

```markdown
# 记忆系统指引

## 记忆类型

- **preference**: 用户偏好和设置
- **feedback**: 反馈和纠正
- **knowledge**: 项目知识和信息
- **pattern**: 反复出现的模式

## 整理流程

1. **收集**: 从 raw 目录收集原始记忆
2. **分类**: 根据类型分类记忆
3. **整合**: 合并相关记忆
4. **归档**: 保存到适当的位置

## 最佳实践

- 保持记忆文件简洁明了
- 使用一致的命名 convention
- 定期清理过时记忆
- 利用 Obsidian 的链接功能
```

## 快速开始

### OpenClaw 命令

```bash
# 加载主技能
openclaw run seven-memory

# 执行初始化
openclaw run seven-memory:init

# 运行测试
openclaw run seven-memory:test

# 运行监控
openclaw run seven-memory:monitor

# 运行性能优化
openclaw run seven-memory:optimize

# 手动执行梦境
openclaw run seven-memory:dream
```

### 直接运行

```bash
# 加载主技能
skill(name="seven-memory")

# 会话记忆 - 多轮任务时使用
skill(name="memory-layer-3-session-memory")

# 梦境 - 检查长期记忆
skill(name="memory-layer-6-dream")
```

## 各层详解

### Layer 1: 工具结果存储

**成本**: 极低 (磁盘写入 + 预览)

**机制**: 大于 8KB 的工具输出写入 `.openclaw/tool-results/<uuid>.txt`，上下文仅保留 2KB 预览。

### Layer 2: 微压缩

**成本**: 低 (仅缓存清理，无需 LLM)

**机制**: 轻量级清理，不生成摘要。使用 `cache_edits` 清理而不破坏提示词缓存。

**可清理**: FileRead, Bash, Grep, Glob, WebSearch, WebFetch  
**豁免**: Thinking 区块、消息、MCP 工具结果

### Layer 3: 会话记忆

**成本**: 中 (增量更新)

**机制**: 在对话期间维护实时笔记，在上下文压缩时保留下关键信息。

### Layer 4: 全量压缩

**成本**: 高 (需要 LLM 生成摘要)

**机制**: 完整上下文摘要，包含 9 大区块。

**摘要结构**:
1. 主要请求与意图
2. 关键技术概念
3. 文件和代码部分（含代码片段）
4. 错误与修复
5. 问题解决
6. 所有用户消息（逐字保留）
7. 待办任务
8. 当前工作
9. 可选的下一步骤

**熔断保护**: 连续 3 次压缩失败，强制熔断。

### Layer 5: 自动记忆提取

**成本**: 中 (选择性 LLM 调用)

**机制**: 将高价值经验提取到持久化记忆文件。

**记忆类型**:

| 类型 | 说明 | 示例 |
|------|------|------|
| `preference` | 用户偏好 | "用户偏好 TypeScript" |
| `feedback` | 反馈与纠正 | "事件后不使用 mocks" |
| `knowledge` | 项目知识 | "API 端点结构" |
| `pattern` | 反复模式 | "始终使用预编译语句" |

### Layer 6: 梦境

**成本**: 低 (后台处理)

**机制**: 系统空闲时运行后台进程，回溯历史会话，优化长期记忆。

**四个阶段**:

1. **定位**: 阅读 MEMORY.md 了解当前索引
2. **收集**: 审查每日日志，检查漂移记忆，执行定向搜索
3. **巩固**: 写入/更新记忆文件，合并主题，转换日期
4. **修剪**: 更新索引，保持 200 行/25KB 以下，删除过时指针

**OpenClaw 定时任务**: 默认每天凌晨 2 点钟自动执行

### Layer 7: 跨 Agent 通信

**成本**: 中 (协调开销)

**机制**: 派生的 Agent 之间共享上下文和通信。

**继承内容**:
- 相同的系统提示词
- 相同的工具集
- 相同的消息前缀
- 提示词缓存（服务端识别相同前缀）

**深拷贝**:
- Agent 本地变量
- 会话记忆
- Agent 特定状态

## 设计原则

1. **纵深防御**: 每一层阻止下一层更昂贵的触发
2. **提示词缓存保留**: 每个设计决策都考虑缓存影响
3. **隔离与共享**: 深拷贝可变状态，共享提示词缓存
4. **熔断机制**: 自动压缩 3 次重试限制，梦境锁进程互斥
5. **优雅降级**: 各模块异常时静默失败，平滑移交下一层

## 测试与 CI/CD

### 运行测试

```bash
# OpenClaw 命令
openclaw run seven-memory:test

# 直接运行
node test-automation.js

# 运行监控
node monitoring.js --run

# 运行性能优化
node performance-optimization.js
```

### CI/CD 集成

该项目包含 GitHub Actions 配置，自动运行测试和构建流程。

## 语义检索集成 (QMD)

为了实现更强大的语义检索功能，Seven Memory 可以与 OpenClaw 内置的 QMD (Query Markup Documents) 工具集成。QMD 是一个本地搜索引擎，结合了 BM25 全文搜索、向量语义搜索和 LLM 重排序功能。

### 安装 QMD

```bash
# 使用 npm 安装
npm install -g @tobilu/qmd

# 或使用 bun 安装
bun install -g @tobilu/qmd
```

### 配置 QMD

1. **创建集合**：为你的 Obsidian Vault 创建 QMD 集合
   ```bash
   qmd collection add /Users/suana/Documents/Obsidian\ Vault/_wiki --name seven-memory
   ```

2. **添加上下文**：为搜索结果添加上下文信息
   ```bash
   qmd context add qmd://seven-memory "Seven Memory 系统的整理后记忆"
   ```

3. **生成嵌入**：为语义搜索生成向量嵌入
   ```bash
   qmd embed
   ```

### 与 Seven Memory 结合使用

#### 1. 配置 OpenClaw MCP 服务器

在 OpenClaw 配置文件中添加 QMD MCP 服务器：

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

#### 2. 在 Seven Memory 中使用 QMD

##### 搜索记忆

```bash
# 关键词搜索
qmd search "project timeline" -c seven-memory

# 语义搜索
qmd vsearch "如何部署项目" -c seven-memory

# 混合搜索（最佳质量）
qmd query "季度规划流程" -c seven-memory
```

##### 在梦境功能中集成

修改 `dream.js` 文件，在记忆巩固过程中使用 QMD 进行更智能的记忆检索和整合。

##### 自动记忆提取增强

在 `layer-5-auto-memory-extraction` 中使用 QMD 来增强记忆提取的准确性和相关性。

### QMD 高级配置

#### 启动 HTTP 服务器

对于更高效的使用，可以启动 QMD HTTP 服务器：

```bash
# 前台运行
qmd mcp --http

# 后台运行
qmd mcp --http --daemon
```

这样，LLM 模型会保持加载在 VRAM 中，避免重复加载的开销。

## 平台支持

Seven Memory 已在以下平台发布：

- [GitHub](https://github.com)
- [Gitee](https://gitee.com)
- [ClawHub](https://clawhub.ai)
- [SkillHub](https://skillhub.tencent.com)

## 相关文档

- [USAGE.md](USAGE.md) - 详细使用指南
- [test-automation.js](test-automation.js) - 自动化测试脚本
- [monitoring.js](monitoring.js) - 系统监控脚本
- [performance-optimization.js](performance-optimization.js) - 性能优化脚本
- [QMD GitHub](https://github.com/tobi/qmd) - QMD 官方文档

---

*本技能包基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路设计，适用于 OpenClaw 的上下文管理和长期记忆系统。结合 QMD 可实现更强大的语义检索功能。*
