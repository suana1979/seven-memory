#!/usr/bin/env node

/**
 * Seven Memory 初始化脚本
 * 创建默认记忆目录结构和文件
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 默认配置
const defaultConfig = {
  rawMemoryPath: path.join(os.homedir(), 'Documents', 'Obsidian Vault', 'raw'),
  processedMemoryPath: path.join(os.homedir(), 'Documents', 'Obsidian Vault', '_wiki'),
  agentsGuidePath: path.join(os.homedir(), 'Documents', 'Obsidian Vault', '_wiki', 'AGENTS.md')
};

// 初始化目录结构
function initDirectories() {
  console.log('=== 初始化记忆目录结构 ===');
  
  // 创建原始记忆目录
  if (!fs.existsSync(defaultConfig.rawMemoryPath)) {
    fs.mkdirSync(defaultConfig.rawMemoryPath, { recursive: true });
    console.log(`✅ 创建原始记忆目录: ${defaultConfig.rawMemoryPath}`);
  } else {
    console.log(`✅ 原始记忆目录已存在: ${defaultConfig.rawMemoryPath}`);
  }
  
  // 创建处理记忆目录
  if (!fs.existsSync(defaultConfig.processedMemoryPath)) {
    fs.mkdirSync(defaultConfig.processedMemoryPath, { recursive: true });
    console.log(`✅ 创建处理记忆目录: ${defaultConfig.processedMemoryPath}`);
  } else {
    console.log(`✅ 处理记忆目录已存在: ${defaultConfig.processedMemoryPath}`);
  }
}

// 创建 AGENTS.md 指引文件
function createAgentsGuide() {
  console.log('\n=== 创建 AGENTS.md 指引文件 ===');
  
  const agentsGuideContent = '# 记忆系统指引\n\n## 记忆类型\n\n- **preference**: 用户偏好和设置\n- **feedback**: 反馈和纠正\n- **knowledge**: 项目知识和信息\n- **pattern**: 反复出现的模式\n\n## 整理流程\n\n1. **收集**: 从 raw 目录收集原始记忆\n2. **分类**: 根据类型分类记忆\n3. **整合**: 合并相关记忆\n4. **归档**: 保存到适当的位置\n\n## 最佳实践\n\n- 保持记忆文件简洁明了\n- 使用一致的命名 convention\n- 定期清理过时记忆\n- 利用 Obsidian 的链接功能\n\n## 记忆文件格式\n\n### 原始记忆文件\n\n```yaml\n---\nname: memory-name\ndescription: Brief description of the memory\ntype: preference|feedback|knowledge|pattern\ndate: 2026-04-06T12:00:00Z\n---\n\nMemory content here...\n\n**Why:** Reason for remembering this...\n```\n\n### 处理后记忆文件\n\n```markdown\n# Memory Title\n\n## Description\nBrief description of the memory\n\n## Content\nDetailed content here...\n\n## Tags\n- #memory\n- #type:preference\n- #date:2026-04-06\n```\n\n## 梦境处理\n\n梦境功能会自动处理原始记忆，执行以下操作：\n\n1. 读取原始记忆文件\n2. 分析内容并分类\n3. 合并相关记忆\n4. 生成处理后的记忆文件\n5. 更新索引\n\n## 手动整理\n\n如果需要手动整理记忆，可以按照以下步骤操作：\n\n1. 打开 Obsidian Vault\n2. 浏览 raw 目录中的原始记忆\n3. 根据内容和类型进行分类\n4. 合并相关记忆以避免重复\n5. 保存到 _wiki 目录的适当位置\n6. 更新 AGENTS.md 中的索引\n';
  
  if (!fs.existsSync(defaultConfig.agentsGuidePath)) {
    fs.writeFileSync(defaultConfig.agentsGuidePath, agentsGuideContent);
    console.log(`✅ 创建 AGENTS.md 指引文件: ${defaultConfig.agentsGuidePath}`);
  } else {
    console.log(`⚠️ AGENTS.md 指引文件已存在: ${defaultConfig.agentsGuidePath}`);
    console.log('   如需更新，请手动编辑该文件');
  }
}

// 创建默认配置文件
function createDefaultConfig() {
  console.log('\n=== 创建默认配置文件 ===');
  
  // 检查 OpenClaw 配置目录
  const openclawConfigPath = path.join('.openclaw', 'config.json');
  const opencodeConfigPath = path.join('.opencode', 'config.json');
  
  // 优先创建 OpenClaw 配置
  if (!fs.existsSync(path.join('.openclaw'))) {
    fs.mkdirSync(path.join('.openclaw'), { recursive: true });
  }
  
  if (!fs.existsSync(openclawConfigPath)) {
    const configContent = {
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
          rawMemoryPath: defaultConfig.rawMemoryPath,
          processedMemoryPath: defaultConfig.processedMemoryPath,
          agentsGuidePath: defaultConfig.agentsGuidePath
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
    
    fs.writeFileSync(openclawConfigPath, JSON.stringify(configContent, null, 2));
    console.log(`✅ 创建 OpenClaw 默认配置文件: ${openclawConfigPath}`);
  } else {
    console.log(`⚠️ OpenClaw 配置文件已存在: ${openclawConfigPath}`);
    console.log('   如需更新，请手动编辑该文件');
  }
  
  // 同时创建 OpenCode 配置作为备份
  if (!fs.existsSync(path.join('.opencode'))) {
    fs.mkdirSync(path.join('.opencode'), { recursive: true });
  }
  
  if (!fs.existsSync(opencodeConfigPath)) {
    const configContent = {
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
          rawMemoryPath: defaultConfig.rawMemoryPath,
          processedMemoryPath: defaultConfig.processedMemoryPath,
          agentsGuidePath: defaultConfig.agentsGuidePath
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
    
    fs.writeFileSync(opencodeConfigPath, JSON.stringify(configContent, null, 2));
    console.log(`✅ 创建 OpenCode 默认配置文件: ${opencodeConfigPath}`);
  } else {
    console.log(`⚠️ OpenCode 配置文件已存在: ${opencodeConfigPath}`);
    console.log('   如需更新，请手动编辑该文件');
  }
}

// 主函数
function main() {
  console.log('=== Seven Memory 初始化 ===');
  
  // 初始化目录结构
  initDirectories();
  
  // 创建 AGENTS.md 指引文件
  createAgentsGuide();
  
  // 创建默认配置文件
  createDefaultConfig();
  
  console.log('\n=== 初始化完成 ===');
  console.log('\n下一步：');
  console.log('1. 安装依赖: npm install');
  console.log('2. 运行测试: node test-automation.js');
  console.log('3. 启动监控: node monitoring.js --run');
  console.log('4. 手动执行梦境: node dream.js');
  console.log('\nOpenClaw 命令:');
  console.log('  openclaw run seven-memory:test - 运行测试');
  console.log('  openclaw run seven-memory:monitor - 运行监控');
  console.log('  openclaw run seven-memory:dream - 手动执行梦境');
  console.log('\n如需自定义配置，请编辑 .openclaw/config.json 文件');
  console.log('如需自定义梦境执行时间，请编辑 skill.yaml 文件中的 schedules 部分');
}

// 运行初始化
if (require.main === module) {
  main();
}

module.exports = {
  initDirectories,
  createAgentsGuide,
  createDefaultConfig,
  main
};