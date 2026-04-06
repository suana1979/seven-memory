/**
 * AutoDream 记忆整合机制
 * 基于 Claude Code 的 AutoDream 设计
 * 在后台静默回顾近期会话，整合、更新、修剪记忆
 */

const fs = require('fs');
const path = require('path');
const { MEMORY_TYPES, MEMORY_DIRS, INDEX_TEMPLATE } = require('./memory-types');

// 配置默认值
const DEFAULTS = {
  minHours: 24,      // 距离上次整合至少 24 小时
  minSessions: 5,    // 期间至少积累了 5 个会话
  scanIntervalMs: 10 * 60 * 1000, // 10 分钟扫描节流
  maxRuntime: 600000, // 最大运行时间 10 分钟
  lockTimeout: 60 * 60 * 1000, // 锁超时 1 小时
};

// 锁文件路径
const LOCK_FILE = '.memory/.consolidate-lock';

/**
 * 检查是否应该执行 AutoDream
 * @param {Object} config - 配置对象
 * @returns {boolean} - 是否应该执行
 */
function shouldRunAutoDream(config = {}) {
  const { minHours, minSessions, scanIntervalMs } = { ...DEFAULTS, ...config };
  
  // 1. 功能开关
  if (!config.enabled) {
    return false;
  }
  
  // 2. 时间门控
  if (!fs.existsSync(LOCK_FILE)) {
    return true; // 首次运行
  }
  
  const lockStats = fs.statSync(LOCK_FILE);
  const lastRunTime = lockStats.mtime.getTime();
  const now = Date.now();
  const hoursSinceLastRun = (now - lastRunTime) / (1000 * 60 * 60);
  
  if (hoursSinceLastRun < minHours) {
    return false;
  }
  
  // 3. 扫描节流
  const scanThreshold = lastRunTime + scanIntervalMs;
  if (now < scanThreshold) {
    return false;
  }
  
  // 4. 会话门控
  const sessionsDir = path.join(MEMORY_DIRS.ROOT, 'sessions');
  if (fs.existsSync(sessionsDir)) {
    const sessions = fs.readdirSync(sessionsDir).filter(file => {
      const sessionPath = path.join(sessionsDir, file);
      const sessionStats = fs.statSync(sessionPath);
      return sessionStats.mtime.getTime() > lastRunTime;
    });
    
    if (sessions.length < minSessions) {
      return false;
    }
  }
  
  // 5. 锁门控
  if (fs.existsSync(LOCK_FILE)) {
    try {
      const lockContent = fs.readFileSync(LOCK_FILE, 'utf8');
      const { pid, timestamp } = JSON.parse(lockContent);
      
      // 检查锁是否过期
      if (now - timestamp > DEFAULTS.lockTimeout) {
        return true; // 锁已过期
      }
      
      // 检查进程是否存在
      try {
        process.kill(pid, 0);
        return false; // 进程仍在运行
      } catch {
        return true; // 进程已结束
      }
    } catch {
      return true; // 锁文件损坏
    }
  }
  
  return true;
}

/**
 * 获取锁
 * @returns {boolean} - 是否成功获取锁
 */
function acquireLock() {
  try {
    const lockContent = JSON.stringify({
      pid: process.pid,
      timestamp: Date.now()
    });
    fs.writeFileSync(LOCK_FILE, lockContent);
    return true;
  } catch {
    return false;
  }
}

/**
 * 释放锁
 */
function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }
  } catch {
    // 忽略错误
  }
}

/**
 * Phase 1: Orient（定向）
 * @param {string} memoryRoot - 记忆根目录
 * @returns {Object} - 定向结果
 */
function orient(memoryRoot) {
  console.log('Phase 1: Orient - 定向');
  
  // 检查记忆目录
  const memoryDirs = {};
  Object.values(MEMORY_DIRS).forEach(dir => {
    const dirPath = path.join(memoryRoot, dir);
    memoryDirs[dir] = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
  });
  
  // 读取索引文件
  const indexPath = path.join(memoryRoot, 'MEMORY.md');
  let indexContent = '';
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf8');
  }
  
  return {
    memoryDirs,
    indexContent
  };
}

/**
 * Phase 2: Gather recent signal（收集近期信号）
 * @param {string} memoryRoot - 记忆根目录
 * @param {number} lastRunTime - 上次运行时间
 * @returns {Array} - 收集的信号
 */
function gatherRecentSignal(memoryRoot, lastRunTime) {
  console.log('Phase 2: Gather recent signal - 收集近期信号');
  
  const signals = [];
  
  // 1. 每日日志
  const logsDir = path.join(memoryRoot, MEMORY_DIRS.LOGS);
  if (fs.existsSync(logsDir)) {
    const years = fs.readdirSync(logsDir);
    years.forEach(year => {
      const yearDir = path.join(logsDir, year);
      if (fs.statSync(yearDir).isDirectory()) {
        const months = fs.readdirSync(yearDir);
        months.forEach(month => {
          const monthDir = path.join(yearDir, month);
          if (fs.statSync(monthDir).isDirectory()) {
            const logs = fs.readdirSync(monthDir);
            logs.forEach(log => {
              const logPath = path.join(monthDir, log);
              const logStats = fs.statSync(logPath);
              if (logStats.mtime.getTime() > lastRunTime) {
                const logContent = fs.readFileSync(logPath, 'utf8');
                signals.push({ type: 'log', path: logPath, content: logContent });
              }
            });
          }
        });
      }
    });
  }
  
  // 2. 会话记录
  const sessionsDir = path.join(memoryRoot, 'sessions');
  if (fs.existsSync(sessionsDir)) {
    const sessions = fs.readdirSync(sessionsDir);
    sessions.forEach(session => {
      const sessionPath = path.join(sessionsDir, session);
      const sessionStats = fs.statSync(sessionPath);
      if (sessionStats.mtime.getTime() > lastRunTime) {
        const sessionContent = fs.readFileSync(sessionPath, 'utf8');
        signals.push({ type: 'session', path: sessionPath, content: sessionContent });
      }
    });
  }
  
  return signals;
}

/**
 * Phase 3: Consolidate（整合）
 * @param {string} memoryRoot - 记忆根目录
 * @param {Array} signals - 收集的信号
 * @returns {Array} - 整合的记忆
 */
function consolidate(memoryRoot, signals) {
  console.log('Phase 3: Consolidate - 整合');
  
  const consolidatedMemories = [];
  
  // 分析信号，提取有价值的信息
  signals.forEach(signal => {
    // 这里可以添加更复杂的分析逻辑
    // 例如：提取用户偏好、行为反馈、项目动态和外部引用
    
    // 简单示例：提取关键词
    const keywords = extractKeywords(signal.content);
    if (keywords.length > 0) {
      const memory = {
        type: 'project', // 默认为项目动态
        name: `Signal from ${path.basename(signal.path)}`,
        description: `Extracted from ${signal.type}`,
        content: signal.content,
        why: 'Auto-generated from recent activity',
        howToApply: 'Use this information when working on related tasks'
      };
      
      consolidatedMemories.push(memory);
    }
  });
  
  // 合并到已有记忆
  consolidatedMemories.forEach(memory => {
    const memoryDir = path.join(memoryRoot, memory.type);
    if (!fs.existsSync(memoryDir)) {
      fs.mkdirSync(memoryDir, { recursive: true });
    }
    
    const memoryPath = path.join(memoryDir, `${memory.name.replace(/\s+/g, '_').toLowerCase()}.md`);
    const memoryContent = `---
name: ${memory.name}
description: ${memory.description}
type: ${memory.type}
date: ${new Date().toISOString()}
---

${memory.content}

${memory.why ? `**Why:** ${memory.why}\n` : ''}${memory.howToApply ? `**How to apply:** ${memory.howToApply}\n` : ''}`;
    
    fs.writeFileSync(memoryPath, memoryContent);
  });
  
  return consolidatedMemories;
}

/**
 * 提取关键词
 * @param {string} text - 文本内容
 * @returns {Array} - 关键词数组
 */
function extractKeywords(text) {
  // 简单的关键词提取逻辑
  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once']);
  
  return text
    .toLowerCase()
    .replace(/[.,?!;:()\[\]{}"']/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 10); // 取前 10 个关键词
}

/**
 * Phase 4: Prune and index（修剪与索引）
 * @param {string} memoryRoot - 记忆根目录
 */
function pruneAndIndex(memoryRoot) {
  console.log('Phase 4: Prune and index - 修剪与索引');
  
  const memories = [];
  
  // 收集所有记忆文件
  Object.values(MEMORY_TYPES).forEach(type => {
    const typeDir = path.join(memoryRoot, type);
    if (fs.existsSync(typeDir)) {
      const files = fs.readdirSync(typeDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const filePath = path.join(typeDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // 解析 YAML frontmatter
          const frontmatterMatch = fileContent.match(/---([\s\S]*?)---/);
          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const nameMatch = frontmatter.match(/name:\s*(.+)/);
            const descriptionMatch = frontmatter.match(/description:\s*(.+)/);
            
            if (nameMatch && descriptionMatch) {
              memories.push({
                name: nameMatch[1].trim(),
                description: descriptionMatch[1].trim(),
                path: filePath
              });
            }
          }
        }
      });
    }
  });
  
  // 生成索引文件
  const indexContent = INDEX_TEMPLATE(memories);
  const indexPath = path.join(memoryRoot, 'MEMORY.md');
  fs.writeFileSync(indexPath, indexContent);
  
  console.log(`Updated index with ${memories.length} memories`);
}

/**
 * 执行 AutoDream
 * @param {Object} config - 配置对象
 */
async function executeAutoDream(config = {}) {
  console.log('=== AutoDream 记忆整合 ===');
  
  // 检查是否应该运行
  if (!shouldRunAutoDream(config)) {
    console.log('AutoDream 条件未满足，跳过执行');
    return;
  }
  
  // 获取锁
  if (!acquireLock()) {
    console.log('无法获取锁，AutoDream 已在运行');
    return;
  }
  
  try {
    const memoryRoot = path.join(MEMORY_DIRS.ROOT);
    
    // 创建记忆根目录
    if (!fs.existsSync(memoryRoot)) {
      fs.mkdirSync(memoryRoot, { recursive: true });
    }
    
    // 记录开始时间
    const startTime = Date.now();
    
    // Phase 1: Orient
    const { memoryDirs, indexContent } = orient(memoryRoot);
    
    // Phase 2: Gather recent signal
    const lastRunTime = fs.existsSync(LOCK_FILE) ? fs.statSync(LOCK_FILE).mtime.getTime() : 0;
    const signals = gatherRecentSignal(memoryRoot, lastRunTime);
    
    // Phase 3: Consolidate
    const consolidatedMemories = consolidate(memoryRoot, signals);
    
    // Phase 4: Prune and index
    pruneAndIndex(memoryRoot);
    
    // 检查运行时间
    const runTime = Date.now() - startTime;
    if (runTime > DEFAULTS.maxRuntime) {
      console.log(`AutoDream 运行时间过长: ${runTime}ms`);
    }
    
    console.log(`AutoDream 完成，处理了 ${signals.length} 个信号，生成了 ${consolidatedMemories.length} 个记忆`);
  } catch (error) {
    console.error('AutoDream 执行出错:', error);
  } finally {
    // 释放锁
    releaseLock();
  }
}

module.exports = {
  executeAutoDream,
  shouldRunAutoDream,
  DEFAULTS
};