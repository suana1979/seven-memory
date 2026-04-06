#!/usr/bin/env node

/**
 * 记忆系统性能优化脚本
 * 根据实际使用情况调整各层级的阈值和参数
 */

const fs = require('fs');
const path = require('path');

// 配置路径
const openclawConfigPath = path.join('.openclaw', 'config.json');
const opencodeConfigPath = path.join('.opencode', 'config.json');
const opencodeDir = '.opencode';

// 性能优化建议
const optimizationSuggestions = {
  // Layer 1: 工具结果存储
  toolResultStorage: {
    threshold: {
      default: 8192,
      min: 1024,
      max: 32768,
      suggestion: 8192, // 8KB
      description: '工具结果存储阈值，超过此大小的输出将被存储到磁盘'
    },
    previewLength: {
      default: 2048,
      min: 512,
      max: 8192,
      suggestion: 2048, // 2KB
      description: '工具结果预览长度，保留在上下文中的内容大小'
    }
  },
  
  // Layer 2: 微压缩
  microCompact: {
    idleTimeoutMinutes: {
      default: 60,
      min: 15,
      max: 180,
      suggestion: 60,
      description: '空闲超时时间，超过此时间后触发微压缩'
    }
  },
  
  // Layer 3: 会话记忆
  sessionMemory: {
    updateThreshold: {
      default: 4096,
      min: 1024,
      max: 16384,
      suggestion: 4096,
      description: '会话记忆更新阈值，超过此大小后触发更新'
    },
    toolCallThreshold: {
      default: 10,
      min: 5,
      max: 50,
      suggestion: 10,
      description: '工具调用阈值，超过此次数后触发会话记忆更新'
    }
  },
  
  // Layer 4: 全量压缩
  autoCompact: {
    threshold: {
      default: 140000,
      min: 50000,
      max: 200000,
      suggestion: 140000,
      description: '全量压缩阈值，超过此大小后触发压缩'
    },
    retryLimit: {
      default: 3,
      min: 1,
      max: 5,
      suggestion: 3,
      description: '压缩重试限制，超过此次数后触发熔断'
    }
  },
  
  // Layer 5: 自动记忆提取
  autoMemory: {
    maxLines: {
      default: 200,
      min: 50,
      max: 500,
      suggestion: 200,
      description: '记忆索引最大行数'
    },
    maxSize: {
      default: 25000,
      min: 5000,
      max: 50000,
      suggestion: 25000,
      description: '记忆索引最大大小（字节）'
    }
  },
  
  // Layer 6: 梦境
  dream: {
    interval: {
      default: 3600000,
      min: 600000,
      max: 7200000,
      suggestion: 3600000, // 1小时
      description: '梦境执行间隔（毫秒）'
    },
    maxRuntime: {
      default: 600000,
      min: 300000,
      max: 1200000,
      suggestion: 600000, // 10分钟
      description: '梦境最大运行时间（毫秒）'
    }
  }
};

// 分析系统状态
function analyzeSystemState() {
  console.log('=== 分析系统状态 ===');
  
  // 检查目录大小
  const dirsToCheck = [
    path.join('.openclaw', 'session-memory'),
    path.join('.openclaw', 'memory'),
    path.join('.openclaw', 'tool-results'),
    path.join('.opencode', 'session-memory'),
    path.join('.opencode', 'memory'),
    path.join('.opencode', 'tool-results')
  ];
  
  const dirStats = {};
  
  dirsToCheck.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      let totalSize = 0;
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          totalSize += fs.statSync(filePath).size;
        }
      });
      
      dirStats[dir] = {
        fileCount: files.length,
        totalSize: totalSize
      };
      
      console.log(`✅ ${dir}: ${files.length} 个文件, ${totalSize} 字节`);
    } else {
      console.log(`❌ ${dir}: 目录不存在`);
    }
  });
  
  return dirStats;
}

// 读取当前配置
function readCurrentConfig() {
  console.log('\n=== 读取当前配置 ===');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ 配置文件不存在');
    return null;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('✅ 配置文件读取成功');
    return config;
  } catch (error) {
    console.log(`❌ 配置文件解析错误: ${error.message}`);
    return null;
  }
}

// 分析配置并提供优化建议
function analyzeConfig(currentConfig) {
  console.log('\n=== 分析配置并提供优化建议 ===');
  
  if (!currentConfig) {
    console.log('❌ 无法分析配置，配置文件不存在或解析错误');
    return null;
  }
  
  const suggestions = [];
  
  // 分析 Layer 1: 工具结果存储
  if (currentConfig.tools && currentConfig.tools.resultStorage) {
    const resultStorage = currentConfig.tools.resultStorage;
    
    if (resultStorage.threshold !== optimizationSuggestions.toolResultStorage.threshold.suggestion) {
      suggestions.push({
        layer: 'Layer 1: 工具结果存储',
        parameter: 'threshold',
        current: resultStorage.threshold,
        suggested: optimizationSuggestions.toolResultStorage.threshold.suggestion,
        description: optimizationSuggestions.toolResultStorage.threshold.description
      });
    }
    
    if (resultStorage.previewLength !== optimizationSuggestions.toolResultStorage.previewLength.suggestion) {
      suggestions.push({
        layer: 'Layer 1: 工具结果存储',
        parameter: 'previewLength',
        current: resultStorage.previewLength,
        suggested: optimizationSuggestions.toolResultStorage.previewLength.suggestion,
        description: optimizationSuggestions.toolResultStorage.previewLength.description
      });
    }
  }
  
  // 分析 Layer 2: 微压缩
  if (currentConfig.memory && currentConfig.memory.microCompact) {
    const microCompact = currentConfig.memory.microCompact;
    
    if (microCompact.idleTimeoutMinutes !== optimizationSuggestions.microCompact.idleTimeoutMinutes.suggestion) {
      suggestions.push({
        layer: 'Layer 2: 微压缩',
        parameter: 'idleTimeoutMinutes',
        current: microCompact.idleTimeoutMinutes,
        suggested: optimizationSuggestions.microCompact.idleTimeoutMinutes.suggestion,
        description: optimizationSuggestions.microCompact.idleTimeoutMinutes.description
      });
    }
  }
  
  // 分析 Layer 3: 会话记忆
  if (currentConfig.memory && currentConfig.memory.sessionMemory) {
    const sessionMemory = currentConfig.memory.sessionMemory;
    
    if (sessionMemory.updateThreshold !== optimizationSuggestions.sessionMemory.updateThreshold.suggestion) {
      suggestions.push({
        layer: 'Layer 3: 会话记忆',
        parameter: 'updateThreshold',
        current: sessionMemory.updateThreshold,
        suggested: optimizationSuggestions.sessionMemory.updateThreshold.suggestion,
        description: optimizationSuggestions.sessionMemory.updateThreshold.description
      });
    }
    
    if (sessionMemory.toolCallThreshold !== optimizationSuggestions.sessionMemory.toolCallThreshold.suggestion) {
      suggestions.push({
        layer: 'Layer 3: 会话记忆',
        parameter: 'toolCallThreshold',
        current: sessionMemory.toolCallThreshold,
        suggested: optimizationSuggestions.sessionMemory.toolCallThreshold.suggestion,
        description: optimizationSuggestions.sessionMemory.toolCallThreshold.description
      });
    }
  }
  
  // 分析 Layer 4: 全量压缩
  if (currentConfig.memory && currentConfig.memory.autoCompact) {
    const autoCompact = currentConfig.memory.autoCompact;
    
    if (autoCompact.threshold !== optimizationSuggestions.autoCompact.threshold.suggestion) {
      suggestions.push({
        layer: 'Layer 4: 全量压缩',
        parameter: 'threshold',
        current: autoCompact.threshold,
        suggested: optimizationSuggestions.autoCompact.threshold.suggestion,
        description: optimizationSuggestions.autoCompact.threshold.description
      });
    }
    
    if (autoCompact.retryLimit !== optimizationSuggestions.autoCompact.retryLimit.suggestion) {
      suggestions.push({
        layer: 'Layer 4: 全量压缩',
        parameter: 'retryLimit',
        current: autoCompact.retryLimit,
        suggested: optimizationSuggestions.autoCompact.retryLimit.suggestion,
        description: optimizationSuggestions.autoCompact.retryLimit.description
      });
    }
  }
  
  // 分析 Layer 5: 自动记忆提取
  if (currentConfig.memory && currentConfig.memory.autoMemory) {
    const autoMemory = currentConfig.memory.autoMemory;
    
    if (autoMemory.maxLines !== optimizationSuggestions.autoMemory.maxLines.suggestion) {
      suggestions.push({
        layer: 'Layer 5: 自动记忆提取',
        parameter: 'maxLines',
        current: autoMemory.maxLines,
        suggested: optimizationSuggestions.autoMemory.maxLines.suggestion,
        description: optimizationSuggestions.autoMemory.maxLines.description
      });
    }
    
    if (autoMemory.maxSize !== optimizationSuggestions.autoMemory.maxSize.suggestion) {
      suggestions.push({
        layer: 'Layer 5: 自动记忆提取',
        parameter: 'maxSize',
        current: autoMemory.maxSize,
        suggested: optimizationSuggestions.autoMemory.maxSize.suggestion,
        description: optimizationSuggestions.autoMemory.maxSize.description
      });
    }
  }
  
  // 分析 Layer 6: 梦境
  if (currentConfig.memory && currentConfig.memory.dream) {
    const dream = currentConfig.memory.dream;
    
    if (dream.interval !== optimizationSuggestions.dream.interval.suggestion) {
      suggestions.push({
        layer: 'Layer 6: 梦境',
        parameter: 'interval',
        current: dream.interval,
        suggested: optimizationSuggestions.dream.interval.suggestion,
        description: optimizationSuggestions.dream.interval.description
      });
    }
    
    if (dream.maxRuntime !== optimizationSuggestions.dream.maxRuntime.suggestion) {
      suggestions.push({
        layer: 'Layer 6: 梦境',
        parameter: 'maxRuntime',
        current: dream.maxRuntime,
        suggested: optimizationSuggestions.dream.maxRuntime.suggestion,
        description: optimizationSuggestions.dream.maxRuntime.description
      });
    }
  }
  
  if (suggestions.length === 0) {
    console.log('✅ 所有配置参数都已优化');
  } else {
    console.log('📋 优化建议:');
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.layer} - ${suggestion.parameter}`);
      console.log(`   当前值: ${suggestion.current}`);
      console.log(`   建议值: ${suggestion.suggested}`);
      console.log(`   说明: ${suggestion.description}`);
      console.log('');
    });
  }
  
  return suggestions;
}

// 应用优化建议
function applyOptimizations(suggestions, currentConfig) {
  if (!suggestions || suggestions.length === 0) {
    console.log('\n❌ 没有需要应用的优化建议');
    return currentConfig;
  }
  
  console.log('\n=== 应用优化建议 ===');
  
  const optimizedConfig = JSON.parse(JSON.stringify(currentConfig));
  
  suggestions.forEach(suggestion => {
    switch (suggestion.layer) {
      case 'Layer 1: 工具结果存储':
        if (!optimizedConfig.tools) optimizedConfig.tools = {};
        if (!optimizedConfig.tools.resultStorage) optimizedConfig.tools.resultStorage = {};
        optimizedConfig.tools.resultStorage[suggestion.parameter] = suggestion.suggested;
        break;
      case 'Layer 2: 微压缩':
        if (!optimizedConfig.memory) optimizedConfig.memory = {};
        if (!optimizedConfig.memory.microCompact) optimizedConfig.memory.microCompact = {};
        optimizedConfig.memory.microCompact[suggestion.parameter] = suggestion.suggested;
        break;
      case 'Layer 3: 会话记忆':
        if (!optimizedConfig.memory) optimizedConfig.memory = {};
        if (!optimizedConfig.memory.sessionMemory) optimizedConfig.memory.sessionMemory = {};
        optimizedConfig.memory.sessionMemory[suggestion.parameter] = suggestion.suggested;
        break;
      case 'Layer 4: 全量压缩':
        if (!optimizedConfig.memory) optimizedConfig.memory = {};
        if (!optimizedConfig.memory.autoCompact) optimizedConfig.memory.autoCompact = {};
        optimizedConfig.memory.autoCompact[suggestion.parameter] = suggestion.suggested;
        break;
      case 'Layer 5: 自动记忆提取':
        if (!optimizedConfig.memory) optimizedConfig.memory = {};
        if (!optimizedConfig.memory.autoMemory) optimizedConfig.memory.autoMemory = {};
        optimizedConfig.memory.autoMemory[suggestion.parameter] = suggestion.suggested;
        break;
      case 'Layer 6: 梦境':
        if (!optimizedConfig.memory) optimizedConfig.memory = {};
        if (!optimizedConfig.memory.dream) optimizedConfig.memory.dream = {};
        optimizedConfig.memory.dream[suggestion.parameter] = suggestion.suggested;
        break;
    }
    
    console.log(`✅ 已更新 ${suggestion.layer} - ${suggestion.parameter}: ${suggestion.current} → ${suggestion.suggested}`);
  });
  
  // 保存优化后的配置
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  fs.writeFileSync(configPath, JSON.stringify(optimizedConfig, null, 2));
  console.log('\n✅ 优化后的配置已保存');
  
  return optimizedConfig;
}

// 生成性能优化报告
function generateOptimizationReport(systemState, currentConfig, suggestions, optimizedConfig) {
  console.log('\n=== 生成性能优化报告 ===');
  
  const logDir = path.join('.openclaw', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const reportPath = path.join(logDir, `performance-report-${Date.now()}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    systemState: systemState,
    currentConfig: currentConfig,
    suggestions: suggestions,
    optimizedConfig: optimizedConfig,
    summary: {
      totalSuggestions: suggestions ? suggestions.length : 0,
      optimizedParameters: suggestions ? suggestions.length : 0,
      status: suggestions && suggestions.length > 0 ? 'Optimized' : 'Already Optimized'
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ 性能优化报告已生成: ${reportPath}`);
  
  // 输出报告摘要
  console.log('\n=== 优化报告摘要 ===');
  console.log(`系统状态: ${report.summary.status}`);
  console.log(`优化建议数量: ${report.summary.totalSuggestions}`);
  console.log(`已优化参数: ${report.summary.optimizedParameters}`);
  
  if (suggestions && suggestions.length > 0) {
    console.log('\n已优化的参数:');
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.layer} - ${suggestion.parameter}`);
    });
  }
  
  return report;
}

// 主函数
function runPerformanceOptimization() {
  console.log('=== 记忆系统性能优化 ===');
  
  // 分析系统状态
  const systemState = analyzeSystemState();
  
  // 读取当前配置
  const currentConfig = readCurrentConfig();
  
  if (!currentConfig) {
    console.log('\n❌ 无法继续优化，配置文件不存在或解析错误');
    return;
  }
  
  // 分析配置并提供优化建议
  const suggestions = analyzeConfig(currentConfig);
  
  // 应用优化建议
  const optimizedConfig = applyOptimizations(suggestions, currentConfig);
  
  // 生成性能优化报告
  generateOptimizationReport(systemState, currentConfig, suggestions, optimizedConfig);
  
  console.log('\n=== 性能优化完成 ===');
}

// 命令行参数处理
function handleCommandLineArgs() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('记忆系统性能优化工具');
    console.log('用法:');
    console.log('  node performance-optimization.js [options]');
    console.log('');
    console.log('选项:');
    console.log('  --help, -h    显示帮助信息');
    console.log('  --analyze, -a 分析当前配置和系统状态');
    console.log('  --optimize, -o 分析并应用优化建议');
    process.exit(0);
  }
  
  if (args.includes('--analyze') || args.includes('-a')) {
    const systemState = analyzeSystemState();
    const currentConfig = readCurrentConfig();
    if (currentConfig) {
      analyzeConfig(currentConfig);
    }
    process.exit(0);
  }
  
  // 默认运行优化
  runPerformanceOptimization();
}

// 运行性能优化
if (require.main === module) {
  handleCommandLineArgs();
}

module.exports = {
  runPerformanceOptimization,
  analyzeSystemState,
  readCurrentConfig,
  analyzeConfig,
  applyOptimizations,
  generateOptimizationReport
};