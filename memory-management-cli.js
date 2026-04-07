/**
 * 记忆管理命令行工具
 * 提供记忆管理功能的命令行界面
 */

const { listMemories, getMemory, createMemory, updateMemory, deleteMemory, searchMemories, filterMemoriesByType, cleanExpiredMemories, exportMemories, importMemories } = require('./memory-management');

const command = process.argv[2];
const args = process.argv.slice(3);

function printHelp() {
  console.log('=== 记忆管理命令行工具 ===');
  console.log('用法: node memory-management-cli.js <命令> [参数]');
  console.log('');
  console.log('命令:');
  console.log('  list               列出所有记忆');
  console.log('  get <id>           获取单个记忆');
  console.log('  create             创建新记忆');
  console.log('  update <id>        更新记忆');
  console.log('  delete <id>        删除记忆');
  console.log('  search <query>     搜索记忆');
  console.log('  filter <type>      按类型过滤记忆');
  console.log('  clean [days]       清理过期记忆');
  console.log('  export [format]    导出记忆');
  console.log('  help               显示帮助信息');
  console.log('');
  console.log('示例:');
  console.log('  node memory-management-cli.js list');
  console.log('  node memory-management-cli.js search "project"');
  console.log('  node memory-management-cli.js filter user');
}

function main() {
  switch (command) {
    case 'list':
      const memories = listMemories();
      console.log('=== 记忆列表 ===');
      if (memories.length === 0) {
        console.log('没有记忆文件');
      } else {
        memories.forEach(memory => {
          console.log(`${memory.id} (${memory.type}) - ${memory.name}`);
          console.log(`  描述: ${memory.description}`);
          console.log(`  日期: ${memory.date}`);
          console.log('');
        });
      }
      break;

    case 'get':
      if (args.length < 1) {
        console.log('请提供记忆 ID');
        return;
      }
      const memoryId = args[0];
      const memory = getMemory(memoryId);
      if (memory) {
        console.log('=== 记忆详情 ===');
        console.log(`ID: ${memory.id}`);
        console.log(`名称: ${memory.name}`);
        console.log(`类型: ${memory.type}`);
        console.log(`描述: ${memory.description}`);
        console.log(`日期: ${memory.date}`);
        console.log('');
        console.log('内容:');
        console.log(memory.content);
      } else {
        console.log(`没有找到 ID 为 ${memoryId} 的记忆`);
      }
      break;

    case 'create':
      console.log('=== 创建新记忆 ===');
      // 这里可以添加交互式创建记忆的逻辑
      const newMemory = {
        type: 'project',
        name: '测试记忆',
        description: '这是一个测试记忆',
        content: '测试记忆内容',
        why: '测试用',
        howToApply: '用于测试记忆管理功能'
      };
      const createdId = createMemory(newMemory);
      console.log(`创建成功，记忆 ID: ${createdId}`);
      break;

    case 'update':
      if (args.length < 1) {
        console.log('请提供记忆 ID');
        return;
      }
      const updateId = args[0];
      const updates = {
        name: '更新后的测试记忆',
        description: '这是一个更新后的测试记忆',
        content: '更新后的测试记忆内容'
      };
      const updated = updateMemory(updateId, updates);
      if (updated) {
        console.log(`更新成功`);
      } else {
        console.log(`没有找到 ID 为 ${updateId} 的记忆`);
      }
      break;

    case 'delete':
      if (args.length < 1) {
        console.log('请提供记忆 ID');
        return;
      }
      const deleteId = args[0];
      const deleted = deleteMemory(deleteId);
      if (deleted) {
        console.log(`删除成功`);
      } else {
        console.log(`没有找到 ID 为 ${deleteId} 的记忆`);
      }
      break;

    case 'search':
      if (args.length < 1) {
        console.log('请提供搜索关键词');
        return;
      }
      const query = args.join(' ');
      const searchResults = searchMemories(query);
      console.log(`=== 搜索结果 (${searchResults.length}) ===`);
      searchResults.forEach(memory => {
        console.log(`${memory.id} (${memory.type}) - ${memory.name}`);
        console.log(`  描述: ${memory.description}`);
        console.log('');
      });
      break;

    case 'filter':
      if (args.length < 1) {
        console.log('请提供记忆类型');
        return;
      }
      const type = args[0];
      const filteredMemories = filterMemoriesByType(type);
      console.log(`=== ${type} 类型的记忆 (${filteredMemories.length}) ===`);
      filteredMemories.forEach(memory => {
        console.log(`${memory.id} - ${memory.name}`);
        console.log(`  描述: ${memory.description}`);
        console.log('');
      });
      break;

    case 'clean':
      const days = args.length > 0 ? parseInt(args[0]) : 30;
      const deletedCount = cleanExpiredMemories(days);
      console.log(`清理了 ${deletedCount} 个过期记忆`);
      break;

    case 'export':
      const format = args.length > 0 ? args[0] : 'json';
      try {
        const exportContent = exportMemories(format);
        console.log(`=== 导出记忆 (${format}) ===`);
        console.log(exportContent);
      } catch (error) {
        console.error('导出失败:', error.message);
      }
      break;

    case 'help':
    default:
      printHelp();
      break;
  }
}

if (require.main === module) {
  main();
}