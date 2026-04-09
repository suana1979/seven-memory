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
  
  // 使用新的 .memory 目录结构
  const memoryRoot = config.memory?.storage?.memoryRoot || '.memory';
  const userMemoryPath = path.join(memoryRoot, 'user');
  const feedbackMemoryPath = path.join(memoryRoot, 'feedback');
  const projectMemoryPath = path.join(memoryRoot, 'project');
  const referenceMemoryPath = path.join(memoryRoot, 'reference');
  const memoryIndexPath = path.join(memoryRoot, 'MEMORY.md');
  
  console.log(`记忆根目录: ${memoryRoot}`);
  console.log(`用户记忆路径: ${userMemoryPath}`);
  console.log(`反馈记忆路径: ${feedbackMemoryPath}`);
  console.log(`项目记忆路径: ${projectMemoryPath}`);
  console.log(`引用记忆路径: ${referenceMemoryPath}`);
  
  // 检查目录是否存在
  if (!fs.existsSync(memoryRoot)) {
    console.log('⚠️ 记忆根目录不存在');
    return;
  }
  
  // 1. 定位：读取 MEMORY.md 了解当前索引
  console.log('\n1. 定位：读取当前索引');
  let memoryIndex = '';
  
  if (fs.existsSync(memoryIndexPath)) {
    memoryIndex = fs.readFileSync(memoryIndexPath, 'utf8');
    console.log('✅ 读取索引文件成功');
  } else {
    console.log('⚠️ 索引文件不存在，创建新索引');
    memoryIndex = '# 记忆索引\n\n';
    fs.writeFileSync(memoryIndexPath, memoryIndex);
  }
  
  // 2. 收集：审查所有记忆文件
  console.log('\n2. 收集：审查所有记忆');
  const memoryFiles = [];
  
  // 收集用户记忆
  if (fs.existsSync(userMemoryPath)) {
    const userFiles = fs.readdirSync(userMemoryPath);
    userFiles.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(userMemoryPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        memoryFiles.push({ file, content, type: 'user' });
      }
    });
  }
  
  // 收集反馈记忆
  if (fs.existsSync(feedbackMemoryPath)) {
    const feedbackFiles = fs.readdirSync(feedbackMemoryPath);
    feedbackFiles.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(feedbackMemoryPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        memoryFiles.push({ file, content, type: 'feedback' });
      }
    });
  }
  
  // 收集项目记忆
  if (fs.existsSync(projectMemoryPath)) {
    const projectFiles = fs.readdirSync(projectMemoryPath);
    projectFiles.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(projectMemoryPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        memoryFiles.push({ file, content, type: 'project' });
      }
    });
  }
  
  // 收集引用记忆
  if (fs.existsSync(referenceMemoryPath)) {
    const referenceFiles = fs.readdirSync(referenceMemoryPath);
    referenceFiles.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(referenceMemoryPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        memoryFiles.push({ file, content, type: 'reference' });
      }
    });
  }
  
  console.log(`找到 ${memoryFiles.length} 个记忆文件`);
  
  // 3. 巩固：处理记忆文件
  console.log('\n3. 巩固：处理记忆');
  const updatedMemories = [];
  
  memoryFiles.forEach(({ file, content, type }) => {
    console.log(`处理文件: ${file} (${type})`);
    
    // 解析文件内容
    const frontmatterMatch = content.match(/^---[\s\S]*?---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[0];
      const body = content.replace(frontmatter, '').trim();
      
      // 提取记忆名称
      const nameMatch = frontmatter.match(/name:\s*(.+)/);
      const name = nameMatch ? nameMatch[1] : file.replace('.md', '');
      
      // 提取记忆描述
      const descriptionMatch = frontmatter.match(/description:\s*(.+)/);
      const description = descriptionMatch ? descriptionMatch[1] : 'No description';
      
      // 提取重要性和访问频率
      const importanceMatch = frontmatter.match(/importance:\s*(.+)/);
      const importance = importanceMatch ? importanceMatch[1] : 'medium';
      
      const frequencyMatch = frontmatter.match(/frequency:\s*(.+)/);
      const frequency = frequencyMatch ? frequencyMatch[1] : '1';
      
      // 更新记忆文件
      const updatedContent = `---\nname: ${name}\ndescription: ${description}\ntype: ${type}\ndate: ${new Date().toISOString()}\nimportance: ${importance}\nfrequency: ${frequency}\n---\n\n${body}\n`;
      
      // 保存更新后的记忆
      const memoryPath = path.join(memoryRoot, type, file);
      fs.writeFileSync(memoryPath, updatedContent);
      console.log(`✅ 更新记忆: ${file}`);
      
      // 添加到更新列表
      updatedMemories.push({ name, description, type, path: memoryPath });
    }
  });
  
  // 4. 修剪与索引：更新索引
  console.log('\n4. 修剪与索引：更新索引');
  
  // 调用 updateIndexes 函数生成新的索引文件
  const { updateIndexes } = require('./memory-management');
  updateIndexes(memoryRoot);
  console.log('✅ 更新索引文件成功');
  
  // 检查主索引大小
  const mainIndexPath = path.join(memoryRoot, 'MEMORY.md');
  const indexStats = fs.statSync(mainIndexPath);
  if (indexStats.size > 25000) {
    console.log('⚠️ 主索引文件超过 25KB，需要修剪');
    // 简单的修剪逻辑：保留最近的记忆
    const mainIndexContent = fs.readFileSync(mainIndexPath, 'utf8');
    const lines = mainIndexContent.split('\n');
    const trimmedLines = lines.slice(0, 200); // 保留前 200 行
    const trimmedIndex = trimmedLines.join('\n');
    fs.writeFileSync(mainIndexPath, trimmedIndex);
    console.log('✅ 修剪主索引文件成功');
  }
  
  console.log('\n=== 梦境处理完成 ===');
  console.log(`处理了 ${memoryFiles.length} 个记忆文件`);
  console.log(`更新了 ${updatedMemories.length} 个记忆`);
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