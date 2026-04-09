/**
 * 记忆类型定义
 * 基于 Claude Code 记忆系统的四类记忆类型
 */

// 记忆类型枚举
const MEMORY_TYPES = {
  USER: 'user',           // 用户画像：记录用户的角色、目标、技能水平和偏好
  FEEDBACK: 'feedback',   // 行为反馈：用户对工作方式的纠正或肯定
  PROJECT: 'project',     // 项目动态：无法从代码或 Git 历史中推导出的项目上下文
  REFERENCE: 'reference'  // 外部引用：指向外部系统中信息的指针
};

// 记忆文件模板
const MEMORY_TEMPLATE = (type, name, description, content, why, howToApply) => {
  return `---
name: ${name}
description: ${description}
type: ${type}
date: ${new Date().toISOString()}
importance: ${howToApply ? 'high' : 'medium'}
frequency: 1
---

${content}

${why ? `**Why:** ${why}
` : ''}${howToApply ? `**How to apply:** ${howToApply}
` : ''}`;
};

// 记忆目录结构
const MEMORY_DIRS = {
  ROOT: '.memory',
  USER: 'user',
  FEEDBACK: 'feedback',
  PROJECT: 'project',
  REFERENCE: 'reference',
  TEAM: 'team',
  LOGS: 'logs',
  INDEX: {
    MAIN: 'MEMORY.md',
    FULL: 'index.md',
    CONCEPTS: 'concepts',
    SOURCES: 'sources',
    ENTITIES: 'entities'
  }
};

// 主索引文件内容模板 (MEMORY.md, <25KB)
const MAIN_INDEX_TEMPLATE = (importantMemories, frequentMemories, recentMemories) => {
  return `# 记忆主索引

## 📌 重要记忆
${importantMemories.map(memory => {
  const relativePath = memory.path.replace(MEMORY_DIRS.ROOT + '/', '');
  return `- [${memory.name}](${relativePath}) — ${memory.description}`;
}).join('\n')}

## 🔄 高频访问
${frequentMemories.map(memory => {
  const relativePath = memory.path.replace(MEMORY_DIRS.ROOT + '/', '');
  return `- [${memory.name}](${relativePath}) — ${memory.description} (访问频率: ${memory.frequency})`;
}).join('\n')}

## 📅 最近30天
${recentMemories.map(memory => {
  const relativePath = memory.path.replace(MEMORY_DIRS.ROOT + '/', '');
  return `- [${memory.name}](${relativePath}) — ${memory.description} (${new Date(memory.date).toLocaleDateString()})`;
}).join('\n')}

---

完整索引请查看 [index.md](index.md)
`;
};

// 完整索引文件内容模板 (index.md)
const FULL_INDEX_TEMPLATE = (concepts, sources, entities) => {
  return `# 记忆完整索引

## concepts/ - 概念
${concepts.map(item => {
  return `- [${item.name}](${item.path})`;
}).join('\n')}

## sources/ - 来源
${sources.map(item => {
  return `- [${item.name}](${item.path})`;
}).join('\n')}

## entities/ - 实体
${entities.map(item => {
  return `- [${item.name}](${item.path})`;
}).join('\n')}
`;
};

module.exports = {
  MEMORY_TYPES,
  MEMORY_TEMPLATE,
  MEMORY_DIRS,
  MAIN_INDEX_TEMPLATE,
  FULL_INDEX_TEMPLATE
};