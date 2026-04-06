#!/usr/bin/env node

/**
 * Seven Memory 梦境功能脚本
 * 执行记忆巩固和优化
 */

const fs = require('fs');
const path = require('path');

// 配置路径
const configPath = path.join('.openclaw', 'config.json');
const opencodeConfigPath = path.join('.opencode', 'config.json');

// 读取配置
function readConfig() {
  let config = {};
  
  // 尝试从 OpenClaw 配置读取
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('✅ 从 OpenClaw 配置读取成功');
    } catch (error) {
      console.log('⚠️ 读取 OpenClaw 配置失败，尝试读取 OpenCode 配置');
    }
  }
  
  // 如果 OpenClaw 配置不存在，尝试从 OpenCode 配置读取
  if (Object.keys(config).length === 0 && fs.existsSync(opencodeConfigPath)) {
    try {
      config = JSON.parse(fs.readFileSync(opencodeConfigPath, 'utf8'));
      console.log('✅ 从 OpenCode 配置读取成功');
    } catch (error) {
      console.log('⚠️ 读取配置失败，使用默认配置');
      // 使用默认配置
      config = {
        memory: {
          storage: {
            rawMemoryPath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', 'raw'),
            processedMemoryPath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki'),
            agentsGuidePath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki', 'AGENTS.md')
          }
        }
      };
    }
  }
  
  return config;
}

// 梦境处理函数
function processDream() {
  console.log('=== 开始梦境处理 ===');
  
  // 读取配置
  const config = readConfig();
  
  const rawMemoryPath = config.memory?.storage?.rawMemoryPath || path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', 'raw');
  const processedMemoryPath = config.memory?.storage?.processedMemoryPath || path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki');
  const agentsGuidePath = config.memory?.storage?.agentsGuidePath || path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki', 'AGENTS.md');
  
  console.log(`原始记忆路径: ${rawMemoryPath}`);
  console.log(`处理记忆路径: ${processedMemoryPath}`);
  console.log(`指引文件路径: ${agentsGuidePath}`);
  
  // 检查目录是否存在
  if (!fs.existsSync(rawMemoryPath)) {
    console.log('⚠️ 原始记忆目录不存在');
    return;
  }
  
  if (!fs.existsSync(processedMemoryPath)) {
    console.log('⚠️ 处理记忆目录不存在');
    return;
  }
  
  // 1. 定位：读取 MEMORY.md 了解当前索引
  console.log('\n1. 定位：读取当前索引');
  const memoryIndexPath = path.join(processedMemoryPath, 'MEMORY.md');
  let memoryIndex = '';
  
  if (fs.existsSync(memoryIndexPath)) {
    memoryIndex = fs.readFileSync(memoryIndexPath, 'utf8');
    console.log('✅ 读取索引文件成功');
  } else {
    console.log('⚠️ 索引文件不存在，创建新索引');
    memoryIndex = '# Memory Index\n\n## Preferences\n\n## Feedback\n\n## Knowledge\n\n## Patterns\n';
    fs.writeFileSync(memoryIndexPath, memoryIndex);
  }
  
  // 2. 收集：审查原始记忆文件
  console.log('\n2. 收集：审查原始记忆');
  const rawFiles = fs.readdirSync(rawMemoryPath);
  console.log(`找到 ${rawFiles.length} 个原始记忆文件`);
  
  const memoryFiles = [];
  rawFiles.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(rawMemoryPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      memoryFiles.push({ file, content });
    }
  });
  
  // 3. 巩固：处理记忆文件
  console.log('\n3. 巩固：处理记忆');
  memoryFiles.forEach(({ file, content }) => {
    console.log(`处理文件: ${file}`);
    
    // 解析文件内容
    const frontmatterMatch = content.match(/^---[\s\S]*?---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[0];
      const body = content.replace(frontmatter, '').trim();
      
      // 提取记忆类型
      const typeMatch = frontmatter.match(/type:\s*(\w+)/);
      const type = typeMatch ? typeMatch[1] : 'knowledge';
      
      // 提取记忆名称
      const nameMatch = frontmatter.match(/name:\s*(.+)/);
      const name = nameMatch ? nameMatch[1] : file.replace('.md', '');
      
      // 生成处理后的记忆文件
      const processedContent = `# ${name}\n\n## Description\n${frontmatter}\n\n## Content\n${body}\n\n## Tags\n- #memory\n- #type:${type}\n- #date:${new Date().toISOString().split('T')[0]}\n`;
      
      // 保存到处理记忆目录
      const processedFilePath = path.join(processedMemoryPath, file);
      fs.writeFileSync(processedFilePath, processedContent);
      console.log(`✅ 保存处理后的记忆: ${file}`);
      
      // 更新索引
      const indexEntry = `- [[${type}/${name}]] - ${name}\n`;
      if (!memoryIndex.includes(indexEntry)) {
        const typeSection = `## ${type.charAt(0).toUpperCase() + type.slice(1)}s`;
        const sectionIndex = memoryIndex.indexOf(typeSection);
        if (sectionIndex !== -1) {
          const nextSectionIndex = memoryIndex.indexOf('##', sectionIndex + 2);
          if (nextSectionIndex !== -1) {
            memoryIndex = memoryIndex.slice(0, nextSectionIndex) + indexEntry + memoryIndex.slice(nextSectionIndex);
          } else {
            memoryIndex += indexEntry;
          }
        }
      }
    }
  });
  
  // 4. 修剪：更新索引
  console.log('\n4. 修剪：更新索引');
  fs.writeFileSync(memoryIndexPath, memoryIndex);
  console.log('✅ 更新索引文件成功');
  
  // 检查索引大小
  const indexStats = fs.statSync(memoryIndexPath);
  if (indexStats.size > 25000) {
    console.log('⚠️ 索引文件超过 25KB，需要修剪');
    // 简单的修剪逻辑：保留最近的记忆
    const lines = memoryIndex.split('\n');
    const trimmedLines = lines.slice(0, 200); // 保留前 200 行
    const trimmedIndex = trimmedLines.join('\n');
    fs.writeFileSync(memoryIndexPath, trimmedIndex);
    console.log('✅ 修剪索引文件成功');
  }
  
  console.log('\n=== 梦境处理完成 ===');
  console.log(`处理了 ${memoryFiles.length} 个记忆文件`);
  console.log('记忆系统已优化');
}

// 主函数
function main() {
  console.log('=== Seven Memory 梦境功能 ===');
  console.log(`执行时间: ${new Date().toISOString()}`);
  
  try {
    processDream();
  } catch (error) {
    console.error('❌ 梦境处理失败:', error.message);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  processDream,
  main
};