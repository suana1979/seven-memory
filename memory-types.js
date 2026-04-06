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
  LOGS: 'logs'
};

// 索引文件内容模板
const INDEX_TEMPLATE = (memories) => {
  return memories.map(memory => {
    const relativePath = memory.path.replace(MEMORY_DIRS.ROOT + '/', '');
    return `- [${memory.name}](${relativePath}) — ${memory.description}`;
  }).join('\n');
};

module.exports = {
  MEMORY_TYPES,
  MEMORY_TEMPLATE,
  MEMORY_DIRS,
  INDEX_TEMPLATE
};