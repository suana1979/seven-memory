#!/usr/bin/env node

/**
 * 记忆系统监控脚本
 * 跟踪记忆系统的运行状态，提供状态报告和日志记录
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 监控配置
const config = {
  openclawDir: '.openclaw',
  opencodeDir: '.opencode',
  logDir: path.join('.openclaw', 'logs'),
  logFile: path.join('.openclaw', 'logs', 'memory-system.log'),
  checkInterval: 60000, // 1分钟
  maxLogSize: 1048576 // 1MB
};

// 初始化监控
function initMonitoring() {
  // 创建日志目录
  if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir, { recursive: true });
  }
  
  // 创建日志文件
  if (!fs.existsSync(config.logFile)) {
    fs.writeFileSync(config.logFile, '');
  }
  
  log('监控系统初始化完成');
}

// 日志记录函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.log(logEntry.trim());
  
  // 检查日志文件大小
  if (fs.existsSync(config.logFile)) {
    const stats = fs.statSync(config.logFile);
    if (stats.size > config.maxLogSize) {
      // 日志文件过大，创建新文件
      const backupFile = `${config.logFile}.${Date.now()}`;
      fs.renameSync(config.logFile, backupFile);
      fs.writeFileSync(config.logFile, '');
      log(`日志文件已备份到 ${backupFile}`);
    }
  }
  
  // 写入日志
  fs.appendFileSync(config.logFile, logEntry);
}

// 检查系统结构
function checkSystemStructure() {
  log('开始检查系统结构...');
  
  const requiredDirs = [
    path.join(config.openclawDir, 'session-memory'),
    path.join(config.openclawDir, 'memory'),
    path.join(config.openclawDir, 'memory', 'preference'),
    path.join(config.openclawDir, 'memory', 'feedback'),
    path.join(config.openclawDir, 'memory', 'knowledge'),
    path.join(config.openclawDir, 'memory', 'pattern'),
    path.join(config.openclawDir, 'tool-results'),
    config.logDir,
    path.join(config.opencodeDir, 'session-memory'),
    path.join(config.opencodeDir, 'memory'),
    path.join(config.opencodeDir, 'memory', 'preference'),
    path.join(config.opencodeDir, 'memory', 'feedback'),
    path.join(config.opencodeDir, 'memory', 'knowledge'),
    path.join(config.opencodeDir, 'memory', 'pattern'),
    path.join(config.opencodeDir, 'tool-results'),
    path.join(config.opencodeDir, 'logs')
  ];
  
  let allExists = true;
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      log(`❌ 目录不存在: ${dir}`);
      allExists = false;
      // 创建缺失的目录
      fs.mkdirSync(dir, { recursive: true });
      log(`✅ 已创建目录: ${dir}`);
    } else {
      log(`✅ 目录存在: ${dir}`);
    }
  });
  
  return allExists;
}

// 检查配置文件
function checkConfig() {
  log('开始检查配置文件...');
  
  const openclawConfigPath = path.join(config.openclawDir, 'config.json');
  const opencodeConfigPath = path.join(config.opencodeDir, 'config.json');
  
  let configPath = openclawConfigPath;
  if (!fs.existsSync(openclawConfigPath) && fs.existsSync(opencodeConfigPath)) {
    configPath = opencodeConfigPath;
  }
  
  if (!fs.existsSync(configPath)) {
    log('❌ 配置文件不存在');
    return false;
  }
  
  try {
    const configContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // 检查各层级配置
    const requiredConfigs = [
      'memory.sessionMemory',
      'memory.autoCompact',
      'memory.autoMemory',
      'memory.dream',
      'memory.microCompact',
      'tools.resultStorage'
    ];
    
    let allConfigured = true;
    
    requiredConfigs.forEach(configPath => {
      const parts = configPath.split('.');
      let current = configContent;
      let exists = true;
      
      for (const part of parts) {
        if (!current[part]) {
          exists = false;
          break;
        }
        current = current[part];
      }
      
      if (exists) {
        log(`✅ 配置存在: ${configPath}`);
      } else {
        log(`❌ 配置缺失: ${configPath}`);
        allConfigured = false;
      }
    });
    
    return allConfigured;
  } catch (error) {
    log(`❌ 配置文件解析错误: ${error.message}`);
    return false;
  }
}

// 检查记忆文件状态
function checkMemoryFiles() {
  log('开始检查记忆文件状态...');
  
  const memoryDir = path.join(config.openclawDir, 'memory');
  const memoryTypes = ['preference', 'feedback', 'knowledge', 'pattern'];
  
  let totalFiles = 0;
  let totalSize = 0;
  
  memoryTypes.forEach(type => {
    const typeDir = path.join(memoryDir, type);
    if (fs.existsSync(typeDir)) {
      const files = fs.readdirSync(typeDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          totalFiles++;
          const filePath = path.join(typeDir, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      });
      log(`✅ ${type}: ${files.length} 个文件`);
    } else {
      log(`❌ ${type} 目录不存在`);
    }
  });
  
  // 检查索引文件
  const indexFile = path.join(memoryDir, 'MEMORY.md');
  if (fs.existsSync(indexFile)) {
    const stats = fs.statSync(indexFile);
    log(`✅ 索引文件: ${stats.size} 字节`);
  } else {
    log(`❌ 索引文件不存在`);
  }
  
  log(`总计: ${totalFiles} 个记忆文件, ${totalSize} 字节`);
  return { totalFiles, totalSize };
}

// 检查会话记忆状态
function checkSessionMemory() {
  log('开始检查会话记忆状态...');
  
  const sessionDir = path.join(config.openclawDir, 'session-memory');
  
  if (fs.existsSync(sessionDir)) {
    const files = fs.readdirSync(sessionDir);
    log(`✅ 会话记忆文件: ${files.length} 个`);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(sessionDir, file);
        const stats = fs.statSync(filePath);
        log(`  - ${file}: ${stats.size} 字节`);
      }
    });
    
    return files.length;
  } else {
    log(`❌ 会话记忆目录不存在`);
    return 0;
  }
}

// 检查工具结果状态
function checkToolResults() {
  log('开始检查工具结果状态...');
  
  const toolResultsDir = path.join(config.openclawDir, 'tool-results');
  
  if (fs.existsSync(toolResultsDir)) {
    const files = fs.readdirSync(toolResultsDir);
    log(`✅ 工具结果文件: ${files.length} 个`);
    
    let totalSize = 0;
    files.forEach(file => {
      const filePath = path.join(toolResultsDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });
    
    log(`总计: ${totalSize} 字节`);
    return { count: files.length, size: totalSize };
  } else {
    log(`❌ 工具结果目录不存在`);
    return { count: 0, size: 0 };
  }
}

// 生成系统状态报告
function generateStatusReport() {
  log('\n=== 生成系统状态报告 ===');
  
  const report = {
    timestamp: new Date().toISOString(),
    system: {
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem()
    },
    structure: checkSystemStructure(),
    config: checkConfig(),
    memory: checkMemoryFiles(),
    session: checkSessionMemory(),
    tools: checkToolResults()
  };
  
  // 生成报告文件
  const reportPath = path.join(config.logDir, `status-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`状态报告已生成: ${reportPath}`);
  
  // 输出摘要
  log('\n=== 状态摘要 ===');
  log(`系统结构: ${report.structure ? '正常' : '异常'}`);
  log(`配置状态: ${report.config ? '正常' : '异常'}`);
  log(`记忆文件: ${report.memory.totalFiles} 个, ${report.memory.totalSize} 字节`);
  log(`会话记忆: ${report.session} 个文件`);
  log(`工具结果: ${report.tools.count} 个文件, ${report.tools.size} 字节`);
  
  return report;
}

// 清理过期文件
function cleanupOldFiles() {
  log('开始清理过期文件...');
  
  // 清理工具结果文件（超过7天）
  const toolResultsDir = path.join(config.openclawDir, 'tool-results');
  if (fs.existsSync(toolResultsDir)) {
    const files = fs.readdirSync(toolResultsDir);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    files.forEach(file => {
      const filePath = path.join(toolResultsDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtimeMs < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        log(`已清理过期工具结果: ${file}`);
      }
    });
  }
  
  // 清理旧日志文件（超过30天）
  const logFiles = fs.readdirSync(config.logDir);
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  logFiles.forEach(file => {
    if (file.startsWith('status-report-') && file.endsWith('.json')) {
      const filePath = path.join(config.logDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        log(`已清理过期状态报告: ${file}`);
      }
    }
  });
  
  // 同时清理 OpenCode 目录
  const opencodeToolResultsDir = path.join(config.opencodeDir, 'tool-results');
  if (fs.existsSync(opencodeToolResultsDir)) {
    const files = fs.readdirSync(opencodeToolResultsDir);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    files.forEach(file => {
      const filePath = path.join(opencodeToolResultsDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtimeMs < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        log(`已清理过期 OpenCode 工具结果: ${file}`);
      }
    });
  }
  
  log('清理完成');
}

// 主监控函数
function runMonitoring() {
  log('\n=== 记忆系统监控 ===');
  
  // 生成状态报告
  generateStatusReport();
  
  // 清理过期文件
  cleanupOldFiles();
  
  log('监控任务完成');
}

// 启动监控服务
function startMonitoringService() {
  initMonitoring();
  
  // 立即运行一次
  runMonitoring();
  
  // 设置定期检查
  setInterval(runMonitoring, config.checkInterval);
  
  log(`监控服务已启动，检查间隔: ${config.checkInterval / 1000} 秒`);
}

// 命令行参数处理
function handleCommandLineArgs() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('记忆系统监控工具');
    console.log('用法:');
    console.log('  node monitoring.js [options]');
    console.log('');
    console.log('选项:');
    console.log('  --help, -h    显示帮助信息');
    console.log('  --run, -r     运行一次监控');
    console.log('  --service, -s 启动监控服务');
    console.log('  --report, -p  生成状态报告');
    console.log('  --cleanup, -c 清理过期文件');
    process.exit(0);
  }
  
  if (args.includes('--run') || args.includes('-r')) {
    initMonitoring();
    runMonitoring();
    process.exit(0);
  }
  
  if (args.includes('--report') || args.includes('-p')) {
    initMonitoring();
    generateStatusReport();
    process.exit(0);
  }
  
  if (args.includes('--cleanup') || args.includes('-c')) {
    initMonitoring();
    cleanupOldFiles();
    process.exit(0);
  }
  
  if (args.includes('--service') || args.includes('-s')) {
    startMonitoringService();
  } else {
    // 默认运行一次
    initMonitoring();
    runMonitoring();
    process.exit(0);
  }
}

// 运行监控
if (require.main === module) {
  handleCommandLineArgs();
}

module.exports = {
  initMonitoring,
  runMonitoring,
  generateStatusReport,
  cleanupOldFiles,
  startMonitoringService
};