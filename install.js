#!/usr/bin/env node

/**
 * 记忆系统一键安装脚本
 * 通过一条命令行完成整个记忆系统的安装和配置
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建交互式问答界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 问答函数
function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    rl.question(`${question} ${defaultValue ? `[${defaultValue}]` : ''}: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// 显示标题
function showTitle() {
  console.log('\n=== 记忆系统一键安装 ===');
  console.log('基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路');
  console.log('支持 OpenClaw 和 OpenCode 平台\n');
}

// 检查系统环境
function checkEnvironment() {
  console.log('=== 检查系统环境 ===');
  
  // 检查 Node.js 版本
  const nodeVersion = process.version;
  console.log(`Node.js 版本: ${nodeVersion}`);
  
  if (parseFloat(nodeVersion.replace('v', '')) < 18) {
    console.log('警告: Node.js 版本建议 18.0.0 或更高');
  }
  
  // 检查目录结构
  console.log('当前目录:', process.cwd());
  
  console.log('✅ 系统环境检查完成\n');
}

// 创建目录结构
function createDirectoryStructure() {
  console.log('=== 创建目录结构 ===');
  
  const directories = [
    '.openclaw',
    '.openclaw/session-memory',
    '.openclaw/memory',
    '.openclaw/memory/preference',
    '.openclaw/memory/feedback',
    '.openclaw/memory/knowledge',
    '.openclaw/memory/pattern',
    '.openclaw/tool-results',
    '.openclaw/logs',
    '.opencode',
    '.opencode/session-memory',
    '.opencode/memory',
    '.opencode/memory/preference',
    '.opencode/memory/feedback',
    '.opencode/memory/knowledge',
    '.opencode/memory/pattern',
    '.opencode/tool-results',
    '.opencode/logs'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ 创建目录: ${dir}`);
    } else {
      console.log(`⚠️  目录已存在: ${dir}`);
    }
  });
  
  console.log('✅ 目录结构创建完成\n');
}

// 配置默认设置
async function configureSettings() {
  console.log('=== 配置设置 ===');
  
  // 获取用户主目录
  const homeDir = require('os').homedir();
  
  // 默认 Obsidian Vault 路径
  const defaultVaultPath = path.join(homeDir, 'Documents', 'Obsidian Vault');
  
  // 询问用户自定义配置
  const vaultPath = await askQuestion('请输入 Obsidian Vault 路径', defaultVaultPath);
  
  // 询问 OpenClaw 定时任务执行时间
  const cronTime = await askQuestion('请输入每天执行梦境功能的时间 (Cron 格式)', '0 2 * * *');
  
  // 创建配置文件
  const config = {
    memory: {
      sessionMemory: {
        enabled: true,
        updateThreshold: 4096,
        toolCallThreshold: 10
      },
      autoCompact: {
        enabled: true,
        threshold: 140000,
        retryLimit: 3
      },
      autoMemory: {
        enabled: true,
        maxLines: 200,
        maxSize: 25000
      },
      dream: {
        enabled: true,
        interval: 3600000,
        maxRuntime: 600000
      },
      microCompact: {
        idleTimeoutMinutes: 60,
        enabled: true
      },
      storage: {
        rawMemoryPath: path.join(vaultPath, 'raw'),
        processedMemoryPath: path.join(vaultPath, '_wiki'),
        agentsGuidePath: path.join(vaultPath, '_wiki', 'AGENTS.md'),
        memoryRoot: '.memory'
      },
      autoDream: {
        enabled: true,
        minHours: 24,
        minSessions: 5,
        maxRuntime: 600000
      }
    },
    tools: {
      resultStorage: {
        enabled: true,
        threshold: 8192,
        previewLength: 2048
      }
    },
    llm: {
      provider: "default",
      apiKey: "",
      model: ""
    }
  };
  
  // 写入 OpenClaw 配置
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  fs.writeFileSync(openclawConfigPath, JSON.stringify(config, null, 2));
  console.log(`✅ 写入 OpenClaw 配置: ${openclawConfigPath}`);
  
  // 写入 OpenCode 配置
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  fs.writeFileSync(opencodeConfigPath, JSON.stringify(config, null, 2));
  console.log(`✅ 写入 OpenCode 配置: ${opencodeConfigPath}`);
  
  // 更新 OpenClaw 技能配置文件
  const skillYamlPath = path.join('skill.yaml');
  const skillYamlContent = [
    '# OpenClaw 技能配置文件',
    'name: seven-memory',
    'description: 7 层记忆系统技能包，基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路',
    'author: Your Name',
    'version: 1.0.0',
    '',
    '# 定时任务配置',
    'schedules:',
    '  # 每天自动执行梦境功能',
    '  - name: dream',
    '    cron: "' + cronTime + '"',
    '    command: "node dream.js"',
    '    description: "每天执行记忆巩固"',
    '',
    '# 技能命令',
    'commands:',
    '  # 主命令',
    '  - name: default',
    '    description: 显示记忆系统信息',
    '    command: "node index.js"',
    '  ',
    '  # 初始化命令',
    '  - name: init',
    '    description: 初始化记忆目录结构',
    '    command: "node init.js"',
    '  ',
    '  # 测试命令',
    '  - name: test',
    '    description: 运行自动化测试',
    '    command: "node test-automation.js"',
    '  ',
    '  # 监控命令',
    '  - name: monitor',
    '    description: 运行系统监控',
    '    command: "node monitoring.js --run"',
    '  ',
    '  # 性能优化命令',
    '  - name: optimize',
    '    description: 运行性能优化',
    '    command: "node performance-optimization.js"',
    '  ',
    '  # 梦境命令',
    '  - name: dream',
    '    description: 手动执行梦境功能',
    '    command: "node dream.js"',
    '',
    '# 记忆系统配置',
    'config:',
    '  memory:',
    '    sessionMemory:',
    '      enabled: true',
    '      updateThreshold: 4096',
    '      toolCallThreshold: 10',
    '    autoCompact:',
    '      enabled: true',
    '      threshold: 140000',
    '      retryLimit: 3',
    '    autoMemory:',
    '      enabled: true',
    '      maxLines: 200',
    '      maxSize: 25000',
    '    dream:',
    '      enabled: true',
    '      interval: 3600000',
    '      maxRuntime: 600000',
    '    microCompact:',
    '      idleTimeoutMinutes: 60',
    '      enabled: true',
    '    storage:',
    '      rawMemoryPath: "' + vaultPath.replace(/\\/g, '\\\\') + '/raw"',
    '      processedMemoryPath: "' + vaultPath.replace(/\\/g, '\\\\') + '/_wiki"',
    '      agentsGuidePath: "' + vaultPath.replace(/\\/g, '\\\\') + '/_wiki/AGENTS.md"',
    '  tools:',
    '    resultStorage:',
    '      enabled: true',
    '      threshold: 8192',
    '      previewLength: 2048',
    '  llm:',
    '    provider: "default"',
    '    apiKey: ""',
    '    model: ""'
  ].join('\n');
  
  fs.writeFileSync(skillYamlPath, skillYamlContent);
  console.log(`✅ 更新 OpenClaw 技能配置: ${skillYamlPath}`);
  
  // 创建 Obsidian Vault 目录结构
  const rawPath = path.join(vaultPath, 'raw');
  const wikiPath = path.join(vaultPath, '_wiki');
  
  if (!fs.existsSync(rawPath)) {
    fs.mkdirSync(rawPath, { recursive: true });
    console.log(`✅ 创建 Obsidian 原始记忆目录: ${rawPath}`);
  }
  
  if (!fs.existsSync(wikiPath)) {
    fs.mkdirSync(wikiPath, { recursive: true });
    console.log(`✅ 创建 Obsidian 处理记忆目录: ${wikiPath}`);
  }
  
  // 创建新的记忆目录结构
  const memoryRoot = '.memory';
  const memoryDirs = ['user', 'feedback', 'project', 'reference', 'team', 'logs', 'sessions'];
  
  if (!fs.existsSync(memoryRoot)) {
    fs.mkdirSync(memoryRoot, { recursive: true });
    console.log(`✅ 创建记忆根目录: ${memoryRoot}`);
  }
  
  memoryDirs.forEach(dir => {
    const dirPath = path.join(memoryRoot, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ 创建记忆目录: ${dirPath}`);
    }
  });
  
  // 创建记忆索引文件
  const memoryIndexPath = path.join(memoryRoot, 'MEMORY.md');
  if (!fs.existsSync(memoryIndexPath)) {
    fs.writeFileSync(memoryIndexPath, '# 记忆索引\n\n');
    console.log(`✅ 创建记忆索引文件: ${memoryIndexPath}`);
  }
  
  // 创建 AGENTS.md 文件
  const agentsGuidePath = path.join(vaultPath, '_wiki', 'AGENTS.md');
  if (!fs.existsSync(agentsGuidePath)) {
    const agentsGuideContent = [
      '# AGENTS.md',
      '',
      '## 记忆系统架构',
      '',
      '基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路。',
      '',
      '### 7 层记忆架构',
      '',
      '1. **工具结果存储** - 存储和管理工具调用结果',
      '2. **微压缩** - 定期压缩会话记忆',
      '3. **会话记忆** - 记录当前会话的状态和信息',
      '4. **全量压缩** - 定期压缩和整理记忆',
      '5. **自动记忆提取** - 从会话中提取有价值的信息',
      '6. **梦境** - 深度处理和巩固记忆',
      '7. **跨 Agent 通信** - 实现不同 Agent 之间的信息共享',
      '',
      '### 记忆类型',
      '',
      '1. **User** - 用户画像：记录用户的角色、目标、技能水平和偏好',
      '2. **Feedback** - 行为反馈：用户对工作方式的纠正或肯定',
      '3. **Project** - 项目动态：无法从代码或 Git 历史中推导出的项目上下文',
      '4. **Reference** - 外部引用：指向外部系统中信息的指针',
      '',
      '### 知识库结构',
      '',
      '- **raw/** - 原始源文件',
      '- **_wiki/** - 处理后的记忆和知识库',
      '- **_wiki/MEMORY.md** - 记忆索引',
      '- **.memory/** - 新的记忆存储结构',
      '  - **user/** - 用户画像记忆',
      '  - **feedback/** - 行为反馈记忆',
      '  - **project/** - 项目动态记忆',
      '  - **reference/** - 外部引用记忆',
      '  - **team/** - 团队共享记忆',
      '  - **logs/** - 日志文件',
      '  - **sessions/** - 会话记录',
      '  - **MEMORY.md** - 记忆索引',
      '',
      '## 使用指南',
      '',
      '### 命令',
      '',
      '- `node init.js` - 初始化记忆目录结构',
      '- `node test-automation.js` - 运行自动化测试',
      '- `node monitoring.js --run` - 运行系统监控',
      '- `node performance-optimization.js` - 运行性能优化',
      '- `node dream.js` - 手动执行梦境功能',
      '- `node memory-management.js` - 管理记忆',
      '',
      '### AutoDream 记忆整合',
      '',
      '- 系统会在后台自动执行记忆整合',
      '- 默认每 24 小时执行一次，至少积累 5 个会话',
      '- 整合流程：定向 → 收集近期信号 → 整合 → 修剪与索引',
      '',
      '### OpenClaw 定时任务',
      '',
      '- 每天自动执行梦境功能，巩固记忆',
      '',
      '## 配置',
      '',
      '配置文件位于：',
      '- `.openclaw/config.json` - OpenClaw 配置',
      '- `.opencode/config.json` - OpenCode 配置',
      '- `skill.yaml` - OpenClaw 技能配置'
    ].join('\n');
    
    fs.writeFileSync(agentsGuidePath, agentsGuideContent);
    console.log(`✅ 创建 AGENTS.md 文件: ${agentsGuidePath}`);
  }
  
  console.log('✅ 配置设置完成\n');
}

// 验证安装
function verifyInstallation() {
  console.log('=== 验证安装 ===');
  
  // 检查必要的文件
  const requiredFiles = [
    'install.js',
    'init.js',
    'test-automation.js',
    'monitoring.js',
    'performance-optimization.js',
    'dream.js',
    'index.js',
    'skill.yaml',
    '.openclaw/config.json',
    '.opencode/config.json'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ 文件存在: ${file}`);
    } else {
      console.log(`❌ 文件缺失: ${file}`);
      allFilesExist = false;
    }
  });
  
  // 检查目录结构
  const requiredDirs = [
    '.openclaw/session-memory',
    '.openclaw/memory',
    '.openclaw/tool-results',
    '.openclaw/logs',
    '.opencode/session-memory',
    '.opencode/memory',
    '.opencode/tool-results',
    '.opencode/logs'
  ];
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ 目录存在: ${dir}`);
    } else {
      console.log(`❌ 目录缺失: ${dir}`);
      allFilesExist = false;
    }
  });
  
  console.log('\n=== 安装验证结果 ===');
  if (allFilesExist) {
    console.log('✅ 安装验证通过，所有必要的文件和目录都已创建');
  } else {
    console.log('❌ 安装验证失败，部分文件或目录缺失');
  }
  
  console.log('\n=== 安装完成 ===');
  console.log('记忆系统已成功安装和配置');
  console.log('\n使用指南:');
  console.log('1. 运行 `node init.js` 初始化记忆目录结构');
  console.log('2. 运行 `node test-automation.js` 验证所有功能');
  console.log('3. 在 OpenClaw 中，记忆系统会每天自动执行梦境功能');
  console.log('4. 可以通过修改 skill.yaml 文件自定义定时任务执行时间');
  console.log('\n祝您使用愉快！');
}

// 主安装流程
async function main() {
  showTitle();
  checkEnvironment();
  createDirectoryStructure();
  await configureSettings();
  verifyInstallation();
  
  // 关闭问答界面
  rl.close();
}

// 运行安装流程
if (require.main === module) {
  main().catch(error => {
    console.error('安装过程中出现错误:', error);
    rl.close();
  });
}

module.exports = {
  main,
  checkEnvironment,
  createDirectoryStructure,
  configureSettings,
  verifyInstallation
};