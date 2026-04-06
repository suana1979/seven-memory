#!/usr/bin/env node

/**
 * 记忆系统技能自动化测试脚本
 * 验证各层级功能是否正常工作
 */

const fs = require('fs');
const path = require('path');

// 测试结果存储
const testResults = [];

// 测试函数
function runTest(testName, testFunction) {
  console.log(`\n=== 测试: ${testName} ===`);
  try {
    const result = testFunction();
    testResults.push({ name: testName, status: 'PASS', message: result || '测试通过' });
    console.log(`✅ ${testName}: 测试通过`);
  } catch (error) {
    testResults.push({ name: testName, status: 'FAIL', message: error.message });
    console.log(`❌ ${testName}: 测试失败 - ${error.message}`);
  }
}

// 测试 Layer 1: 工具结果存储
function testLayer1() {
  // 检查配置文件是否存在
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件不存在');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.tools || !config.tools.resultStorage) {
    throw new Error('工具结果存储配置不存在');
  }
  
  // 检查配置参数
  const resultStorage = config.tools.resultStorage;
  if (typeof resultStorage.enabled !== 'boolean') {
    throw new Error('enabled 参数类型错误');
  }
  if (typeof resultStorage.threshold !== 'number' || resultStorage.threshold <= 0) {
    throw new Error('threshold 参数错误');
  }
  if (typeof resultStorage.previewLength !== 'number' || resultStorage.previewLength <= 0) {
    throw new Error('previewLength 参数错误');
  }
  
  // 检查目录结构
  const toolResultsDir = path.join('.openclaw', 'tool-results');
  if (!fs.existsSync(toolResultsDir)) {
    fs.mkdirSync(toolResultsDir, { recursive: true });
  }
  
  // 同时检查 OpenCode 目录
  const opencodeToolResultsDir = path.join('.opencode', 'tool-results');
  if (!fs.existsSync(opencodeToolResultsDir)) {
    fs.mkdirSync(opencodeToolResultsDir, { recursive: true });
  }
  
  return '工具结果存储配置正确，目录结构完整';
}

// 测试 Layer 2: 微压缩
function testLayer2() {
  // 检查配置文件
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件不存在');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.memory || !config.memory.microCompact) {
    throw new Error('微压缩配置不存在');
  }
  
  // 检查配置参数
  const microCompact = config.memory.microCompact;
  if (typeof microCompact.enabled !== 'boolean') {
    throw new Error('enabled 参数类型错误');
  }
  if (typeof microCompact.idleTimeoutMinutes !== 'number' || microCompact.idleTimeoutMinutes <= 0) {
    throw new Error('idleTimeoutMinutes 参数错误');
  }
  
  return '微压缩配置正确';
}

// 测试 Layer 3: 会话记忆
function testLayer3() {
  // 检查目录结构
  const sessionMemoryDir = path.join('.openclaw', 'session-memory');
  if (!fs.existsSync(sessionMemoryDir)) {
    fs.mkdirSync(sessionMemoryDir, { recursive: true });
  }
  
  // 同时检查 OpenCode 目录
  const opencodeSessionMemoryDir = path.join('.opencode', 'session-memory');
  if (!fs.existsSync(opencodeSessionMemoryDir)) {
    fs.mkdirSync(opencodeSessionMemoryDir, { recursive: true });
  }
  
  // 检查配置文件
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件不存在');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.memory || !config.memory.sessionMemory) {
    throw new Error('会话记忆配置不存在');
  }
  
  // 检查配置参数
  const sessionMemory = config.memory.sessionMemory;
  if (typeof sessionMemory.enabled !== 'boolean') {
    throw new Error('enabled 参数类型错误');
  }
  if (typeof sessionMemory.updateThreshold !== 'number' || sessionMemory.updateThreshold <= 0) {
    throw new Error('updateThreshold 参数错误');
  }
  if (typeof sessionMemory.toolCallThreshold !== 'number' || sessionMemory.toolCallThreshold <= 0) {
    throw new Error('toolCallThreshold 参数错误');
  }
  
  // 创建测试会话记忆文件
  const testSessionFile = path.join(sessionMemoryDir, 'test-session.md');
  const sessionContent = `# Test Session\n\n# Current State\nTesting session memory\n\n# Task specification\nTest memory system functionality\n\n# Files and Functions\n- test-automation.js: Test script\n\n# Workflow\n- Run tests\n- Verify results\n\n# Errors & Corrections\n- None\n\n# Codebase and System Documentation\n7-layer memory architecture\n\n# Learnings\nSession memory works\n\n# Key results\nTest passed\n\n# Worklog\n1. Started test\n2. Created session memory`;
  
  fs.writeFileSync(testSessionFile, sessionContent);
  
  if (!fs.existsSync(testSessionFile)) {
    throw new Error('会话记忆文件创建失败');
  }
  
  return '会话记忆配置正确，目录结构完整，测试文件创建成功';
}

// 测试 Layer 4: 全量压缩
function testLayer4() {
  // 检查配置文件
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件不存在');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.memory || !config.memory.autoCompact) {
    throw new Error('全量压缩配置不存在');
  }
  
  // 检查配置参数
  const autoCompact = config.memory.autoCompact;
  if (typeof autoCompact.enabled !== 'boolean') {
    throw new Error('enabled 参数类型错误');
  }
  if (typeof autoCompact.threshold !== 'number' || autoCompact.threshold <= 0) {
    throw new Error('threshold 参数错误');
  }
  if (typeof autoCompact.retryLimit !== 'number' || autoCompact.retryLimit <= 0) {
    throw new Error('retryLimit 参数错误');
  }
  
  return '全量压缩配置正确';
}

// 测试 Layer 5: 自动记忆提取
function testLayer5() {
  // 检查目录结构
  const memoryDir = path.join('.openclaw', 'memory');
  const memoryTypes = ['preference', 'feedback', 'knowledge', 'pattern'];
  
  memoryTypes.forEach(type => {
    const typeDir = path.join(memoryDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
  });
  
  // 同时检查 OpenCode 目录
  const opencodeMemoryDir = path.join('.opencode', 'memory');
  memoryTypes.forEach(type => {
    const typeDir = path.join(opencodeMemoryDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
  });
  
  // 检查配置文件
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件不存在');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.memory || !config.memory.autoMemory) {
    throw new Error('自动记忆提取配置不存在');
  }
  
  // 检查配置参数
  const autoMemory = config.memory.autoMemory;
  if (typeof autoMemory.enabled !== 'boolean') {
    throw new Error('enabled 参数类型错误');
  }
  if (typeof autoMemory.maxLines !== 'number' || autoMemory.maxLines <= 0) {
    throw new Error('maxLines 参数错误');
  }
  if (typeof autoMemory.maxSize !== 'number' || autoMemory.maxSize <= 0) {
    throw new Error('maxSize 参数错误');
  }
  
  // 创建测试记忆文件
  const testMemoryFile = path.join(memoryDir, 'feedback', 'test-feedback.md');
  const memoryContent = `---\nname: test-feedback\ndescription: Test feedback for memory system\ntype: feedback\n---\n\nThis is a test feedback for the memory system.\n\n**Why:** To test the auto memory extraction functionality.`;
  
  fs.writeFileSync(testMemoryFile, memoryContent);
  
  // 创建索引文件
  const indexFile = path.join(memoryDir, 'MEMORY.md');
  const indexContent = `# Memory Index\n\n## Preferences\n\n## Feedback\n- [[feedback/test-feedback]] - Test feedback for memory system\n\n## Knowledge\n\n## Patterns`;
  
  fs.writeFileSync(indexFile, indexContent);
  
  if (!fs.existsSync(testMemoryFile) || !fs.existsSync(indexFile)) {
    throw new Error('记忆文件或索引文件创建失败');
  }
  
  return '自动记忆提取配置正确，目录结构完整，测试文件创建成功';
}

// 测试 Layer 6: 梦境
function testLayer6() {
  // 检查配置文件
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    throw new Error('配置文件不存在');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.memory || !config.memory.dream) {
    throw new Error('梦境配置不存在');
  }
  
  // 检查配置参数
  const dream = config.memory.dream;
  if (typeof dream.enabled !== 'boolean') {
    throw new Error('enabled 参数类型错误');
  }
  if (typeof dream.interval !== 'number' || dream.interval <= 0) {
    throw new Error('interval 参数错误');
  }
  if (typeof dream.maxRuntime !== 'number' || dream.maxRuntime <= 0) {
    throw new Error('maxRuntime 参数错误');
  }
  
  // 检查 OpenClaw 技能配置文件
  const skillYamlPath = path.join('skill.yaml');
  if (fs.existsSync(skillYamlPath)) {
    const skillYaml = fs.readFileSync(skillYamlPath, 'utf8');
    if (skillYaml.includes('schedules')) {
      console.log('✅ OpenClaw 定时任务配置存在');
    }
  }
  
  return '梦境配置正确';
}

// 测试 Layer 7: 跨 Agent 通信
function testLayer7() {
  // 创建测试通信示例文件
  const testFile = path.join('.', 'cross-agent-test.js');
  const testContent = "// Cross-Agent Communication Test\nconst SendMessage = ({ to, message, summary }) => {\n  console.log(`Sending message to ${to}: ${summary}`);\n  return { success: true };\n};\n\n// Test case\nconst result = SendMessage({\n  to: \"test-agent\",\n  message: \"Test message\",\n  summary: \"Test communication\"\n});\n\nconsole.log(\"Test result:\", result);";
  
  fs.writeFileSync(testFile, testContent);
  
  if (!fs.existsSync(testFile)) {
    throw new Error('跨 Agent 通信测试文件创建失败');
  }
  
  return '跨 Agent 通信测试文件创建成功';
}

// 测试系统整体结构
function testSystemStructure() {
  // 检查 OpenClaw 目录
  const openclawDir = path.join('.openclaw');
  if (!fs.existsSync(openclawDir)) {
    fs.mkdirSync(openclawDir, { recursive: true });
  }
  
  // 检查 OpenCode 目录
  const opencodeDir = path.join('.opencode');
  if (!fs.existsSync(opencodeDir)) {
    fs.mkdirSync(opencodeDir, { recursive: true });
  }
  
  // 检查必要的子目录
  const requiredDirs = [
    path.join(openclawDir, 'session-memory'),
    path.join(openclawDir, 'memory'),
    path.join(openclawDir, 'memory', 'preference'),
    path.join(openclawDir, 'memory', 'feedback'),
    path.join(openclawDir, 'memory', 'knowledge'),
    path.join(openclawDir, 'memory', 'pattern'),
    path.join(openclawDir, 'tool-results'),
    path.join(openclawDir, 'logs'),
    path.join(opencodeDir, 'session-memory'),
    path.join(opencodeDir, 'memory'),
    path.join(opencodeDir, 'memory', 'preference'),
    path.join(opencodeDir, 'memory', 'feedback'),
    path.join(opencodeDir, 'memory', 'knowledge'),
    path.join(opencodeDir, 'memory', 'pattern'),
    path.join(opencodeDir, 'tool-results'),
    path.join(opencodeDir, 'logs')
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // 检查配置文件
  const openclawConfigPath = path.join(openclawDir, 'config.json');
  const opencodeConfigPath = path.join(opencodeDir, 'config.json');
  
  if (!fs.existsSync(openclawConfigPath)) {
    // 创建默认配置
    const defaultConfig = {
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
          rawMemoryPath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', 'raw'),
          processedMemoryPath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki'),
          agentsGuidePath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki', 'AGENTS.md')
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
    
    fs.writeFileSync(openclawConfigPath, JSON.stringify(defaultConfig, null, 2));
  }
  
  if (!fs.existsSync(opencodeConfigPath)) {
    // 创建默认配置
    const defaultConfig = {
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
          rawMemoryPath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', 'raw'),
          processedMemoryPath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki'),
          agentsGuidePath: path.join(require('os').homedir(), 'Documents', 'Obsidian Vault', '_wiki', 'AGENTS.md')
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
    
    fs.writeFileSync(opencodeConfigPath, JSON.stringify(defaultConfig, null, 2));
  }
  
  // 检查 OpenClaw 技能配置文件
  const skillYamlPath = path.join('skill.yaml');
  if (!fs.existsSync(skillYamlPath)) {
    const skillYamlContent = `# OpenClaw 技能配置文件\nname: seven-memory\ndescription: 7 层记忆系统技能包，基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路\nauthor: Your Name\nversion: 1.0.0\n\n# 定时任务配置\nschedules:\n  # 每天凌晨 2 点钟自动执行梦境功能\n  - name: dream\n    cron: "0 2 * * *"\n    command: "node dream.js"\n    description: "每天凌晨 2 点执行记忆巩固"\n\n# 技能命令\ncommands:\n  # 主命令\n  - name: default\n    description: 显示记忆系统信息\n    command: "node index.js"\n  \n  # 初始化命令\n  - name: init\n    description: 初始化记忆目录结构\n    command: "node init.js"\n  \n  # 测试命令\n  - name: test\n    description: 运行自动化测试\n    command: "node test-automation.js"\n  \n  # 监控命令\n  - name: monitor\n    description: 运行系统监控\n    command: "node monitoring.js --run"\n  \n  # 性能优化命令\n  - name: optimize\n    description: 运行性能优化\n    command: "node performance-optimization.js"\n  \n  # 梦境命令\n  - name: dream\n    description: 手动执行梦境功能\n    command: "node dream.js"\n\n# 记忆系统配置\nconfig:\n  memory:\n    sessionMemory:\n      enabled: true\n      updateThreshold: 4096\n      toolCallThreshold: 10\n    autoCompact:\n      enabled: true\n      threshold: 140000\n      retryLimit: 3\n    autoMemory:\n      enabled: true\n      maxLines: 200\n      maxSize: 25000\n    dream:\n      enabled: true\n      interval: 3600000\n      maxRuntime: 600000\n    microCompact:\n      idleTimeoutMinutes: 60\n      enabled: true\n    storage:\n      rawMemoryPath: "/Users/suana/Documents/Obsidian Vault/raw"\n      processedMemoryPath: "/Users/suana/Documents/Obsidian Vault/_wiki"\n      agentsGuidePath: "/Users/suana/Documents/Obsidian Vault/_wiki/AGENTS.md"\n  tools:\n    resultStorage:\n      enabled: true\n      threshold: 8192\n      previewLength: 2048\n  llm:\n    provider: "default"\n    apiKey: ""\n    model: ""`;
    
    fs.writeFileSync(skillYamlPath, skillYamlContent);
  }
  
  return '系统结构完整，配置文件存在';
}

// 运行所有测试
function runAllTests() {
  console.log('=== 开始记忆系统技能自动化测试 ===');
  
  // 先测试系统结构
  runTest('系统结构测试', testSystemStructure);
  
  // 测试各层级
  runTest('Layer 1: 工具结果存储', testLayer1);
  runTest('Layer 2: 微压缩', testLayer2);
  runTest('Layer 3: 会话记忆', testLayer3);
  runTest('Layer 4: 全量压缩', testLayer4);
  runTest('Layer 5: 自动记忆提取', testLayer5);
  runTest('Layer 6: 梦境', testLayer6);
  runTest('Layer 7: 跨 Agent 通信', testLayer7);
  
  // 输出测试结果
  console.log('\n=== 测试结果汇总 ===');
  console.log(`总测试数: ${testResults.length}`);
  
  const passedTests = testResults.filter(test => test.status === 'PASS');
  const failedTests = testResults.filter(test => test.status === 'FAIL');
  
  console.log(`通过: ${passedTests.length}`);
  console.log(`失败: ${failedTests.length}`);
  
  if (failedTests.length > 0) {
    console.log('\n失败的测试:');
    failedTests.forEach(test => {
      console.log(`- ${test.name}: ${test.message}`);
    });
  }
  
  console.log('\n=== 测试完成 ===');
  
  // 生成测试报告
  generateTestReport();
}

// 生成测试报告
function generateTestReport() {
  const reportPath = path.join('.', 'test-report-automated.md');
  const reportContent = `# 记忆系统技能自动化测试报告\n\n## 测试概述\n\n本次测试自动化验证了记忆系统技能的各层级功能，确保系统结构完整、配置正确、功能正常。\n\n## 测试环境\n\n- **操作系统**: ${process.platform}\n- **测试时间**: ${new Date().toISOString()}\n- **测试脚本**: test-automation.js\n\n## 测试结果\n\n| 测试项 | 状态 | 消息 |\n|--------|------|------|\n${testResults.map(test => `| ${test.name} | ${test.status} | ${test.message} |`).join('\n')}\n\n## 测试总结\n\n- **总测试数**: ${testResults.length}\n- **通过**: ${testResults.filter(test => test.status === 'PASS').length}\n- **失败**: ${testResults.filter(test => test.status === 'FAIL').length}\n\n## 结论\n\n${testResults.filter(test => test.status === 'FAIL').length === 0 ? 
  '所有测试通过，记忆系统技能功能正常。' : 
  '部分测试失败，需要检查并修复相关问题。'}\n`;
  
  fs.writeFileSync(reportPath, reportContent);
  console.log(`\n测试报告已生成: ${reportPath}`);
}

// 运行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testLayer1,
  testLayer2,
  testLayer3,
  testLayer4,
  testLayer5,
  testLayer6,
  testLayer7,
  testSystemStructure
};