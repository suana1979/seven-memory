/**
 * 记忆管理功能
 * 基于 Claude Code 的记忆管理设计
 * 提供查看、编辑、删除记忆等功能
 */

const fs = require('fs');
const path = require('path');
const { MEMORY_TYPES, MEMORY_DIRS, MEMORY_TEMPLATE } = require('./memory-types');

/**
 * 列出所有记忆
 * @param {string} memoryRoot - 记忆根目录
 * @returns {Array} - 记忆列表
 */
function listMemories(memoryRoot = MEMORY_DIRS.ROOT) {
  const memories = [];
  
  // 检查记忆根目录是否存在
  if (!fs.existsSync(memoryRoot)) {
    return memories;
  }
  
  // 遍历所有记忆类型目录
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
            const dateMatch = frontmatter.match(/date:\s*(.+)/);
            
            if (nameMatch && descriptionMatch) {
              memories.push({
                id: path.basename(file, '.md'),
                name: nameMatch[1].trim(),
                description: descriptionMatch[1].trim(),
                type: type,
                date: dateMatch ? dateMatch[1].trim() : null,
                path: filePath
              });
            }
          }
        }
      });
    }
  });
  
  // 按日期排序，最新的在前
  memories.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });
  
  return memories;
}

/**
 * 获取单个记忆
 * @param {string} memoryId - 记忆 ID
 * @param {string} memoryRoot - 记忆根目录
 * @returns {Object|null} - 记忆对象
 */
function getMemory(memoryId, memoryRoot = MEMORY_DIRS.ROOT) {
  // 遍历所有记忆类型目录
  for (const type of Object.values(MEMORY_TYPES)) {
    const filePath = path.join(memoryRoot, type, `${memoryId}.md`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // 解析 YAML frontmatter
      const frontmatterMatch = fileContent.match(/---([\s\S]*?)---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const nameMatch = frontmatter.match(/name:\s*(.+)/);
        const descriptionMatch = frontmatter.match(/description:\s*(.+)/);
        const dateMatch = frontmatter.match(/date:\s*(.+)/);
        
        if (nameMatch && descriptionMatch) {
          const content = fileContent.replace(/---[\s\S]*?---/, '').trim();
          
          return {
            id: memoryId,
            name: nameMatch[1].trim(),
            description: descriptionMatch[1].trim(),
            type: type,
            date: dateMatch ? dateMatch[1].trim() : null,
            content: content,
            path: filePath
          };
        }
      }
    }
  }
  
  return null;
}

/**
 * 创建记忆
 * @param {Object} memory - 记忆对象
 * @param {string} memoryRoot - 记忆根目录
 * @returns {string} - 记忆 ID
 */
function createMemory(memory, memoryRoot = MEMORY_DIRS.ROOT) {
  const { type, name, description, content, why, howToApply } = memory;
  
  // 验证类型
  if (!Object.values(MEMORY_TYPES).includes(type)) {
    throw new Error(`Invalid memory type: ${type}`);
  }
  
  // 创建类型目录
  const typeDir = path.join(memoryRoot, type);
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir, { recursive: true });
  }
  
  // 生成记忆 ID
  const memoryId = `${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
  const filePath = path.join(typeDir, `${memoryId}.md`);
  
  // 生成记忆内容
  const memoryContent = MEMORY_TEMPLATE(type, name, description, content, why, howToApply);
  
  // 写入文件
  fs.writeFileSync(filePath, memoryContent);
  
  return memoryId;
}

/**
 * 更新记忆
 * @param {string} memoryId - 记忆 ID
 * @param {Object} updates - 更新内容
 * @param {string} memoryRoot - 记忆根目录
 * @returns {boolean} - 是否更新成功
 */
function updateMemory(memoryId, updates, memoryRoot = MEMORY_DIRS.ROOT) {
  // 查找记忆
  const memory = getMemory(memoryId, memoryRoot);
  if (!memory) {
    return false;
  }
  
  // 合并更新
  const updatedMemory = {
    ...memory,
    ...updates,
    date: new Date().toISOString()
  };
  
  // 生成新的记忆内容
  const memoryContent = MEMORY_TEMPLATE(
    updatedMemory.type,
    updatedMemory.name,
    updatedMemory.description,
    updatedMemory.content,
    updates.why,
    updates.howToApply
  );
  
  // 写入文件
  fs.writeFileSync(updatedMemory.path, memoryContent);
  
  return true;
}

/**
 * 删除记忆
 * @param {string} memoryId - 记忆 ID
 * @param {string} memoryRoot - 记忆根目录
 * @returns {boolean} - 是否删除成功
 */
function deleteMemory(memoryId, memoryRoot = MEMORY_DIRS.ROOT) {
  // 遍历所有记忆类型目录
  for (const type of Object.values(MEMORY_TYPES)) {
    const filePath = path.join(memoryRoot, type, `${memoryId}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  }
  
  return false;
}

/**
 * 搜索记忆
 * @param {string} query - 搜索关键词
 * @param {string} memoryRoot - 记忆根目录
 * @returns {Array} - 搜索结果
 */
function searchMemories(query, memoryRoot = MEMORY_DIRS.ROOT) {
  const memories = listMemories(memoryRoot);
  const queryLower = query.toLowerCase();
  
  return memories.filter(memory => {
    return (
      memory.name.toLowerCase().includes(queryLower) ||
      memory.description.toLowerCase().includes(queryLower) ||
      memory.content.toLowerCase().includes(queryLower)
    );
  });
}

/**
 * 按类型过滤记忆
 * @param {string} type - 记忆类型
 * @param {string} memoryRoot - 记忆根目录
 * @returns {Array} - 过滤后的记忆列表
 */
function filterMemoriesByType(type, memoryRoot = MEMORY_DIRS.ROOT) {
  const memories = listMemories(memoryRoot);
  return memories.filter(memory => memory.type === type);
}

/**
 * 清理过期记忆
 * @param {number} days - 过期天数
 * @param {string} memoryRoot - 记忆根目录
 * @returns {number} - 删除的记忆数量
 */
function cleanExpiredMemories(days = 30, memoryRoot = MEMORY_DIRS.ROOT) {
  const memories = listMemories(memoryRoot);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  let deletedCount = 0;
  
  memories.forEach(memory => {
    if (memory.date) {
      const memoryDate = new Date(memory.date);
      if (memoryDate < cutoffDate) {
        if (deleteMemory(memory.id, memoryRoot)) {
          deletedCount++;
        }
      }
    }
  });
  
  return deletedCount;
}

/**
 * 导出记忆
 * @param {string} format - 导出格式（json 或 md）
 * @param {string} memoryRoot - 记忆根目录
 * @returns {string} - 导出内容
 */
function exportMemories(format = 'json', memoryRoot = MEMORY_DIRS.ROOT) {
  const memories = listMemories(memoryRoot);
  
  if (format === 'json') {
    return JSON.stringify(memories, null, 2);
  } else if (format === 'md') {
    let mdContent = '# 记忆导出\n\n';
    
    // 按类型分组
    const memoriesByType = {};
    memories.forEach(memory => {
      if (!memoriesByType[memory.type]) {
        memoriesByType[memory.type] = [];
      }
      memoriesByType[memory.type].push(memory);
    });
    
    // 生成 Markdown 内容
    Object.entries(memoriesByType).forEach(([type, typeMemories]) => {
      mdContent += `## ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
      
      typeMemories.forEach(memory => {
        mdContent += `### ${memory.name}\n`;
        mdContent += `**描述:** ${memory.description}\n`;
        mdContent += `**日期:** ${memory.date}\n\n`;
        mdContent += `${memory.content}\n\n`;
        mdContent += `---\n\n`;
      });
    });
    
    return mdContent;
  } else {
    throw new Error(`Invalid export format: ${format}`);
  }
}

/**
 * 导入记忆
 * @param {string} content - 导入内容
 * @param {string} format - 导入格式（json 或 md）
 * @param {string} memoryRoot - 记忆根目录
 * @returns {number} - 导入的记忆数量
 */
function importMemories(content, format = 'json', memoryRoot = MEMORY_DIRS.ROOT) {
  let memories = [];
  
  if (format === 'json') {
    try {
      memories = JSON.parse(content);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  } else if (format === 'md') {
    // 解析 Markdown 格式
    // 这里简化处理，实际实现可能需要更复杂的解析
    throw new Error('Markdown import not implemented yet');
  } else {
    throw new Error(`Invalid import format: ${format}`);
  }
  
  let importedCount = 0;
  
  memories.forEach(memory => {
    try {
      createMemory(memory, memoryRoot);
      importedCount++;
    } catch (error) {
      console.error(`Failed to import memory ${memory.name}:`, error);
    }
  });
  
  return importedCount;
}

module.exports = {
  listMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  searchMemories,
  filterMemoriesByType,
  cleanExpiredMemories,
  exportMemories,
  importMemories
};