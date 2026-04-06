/**
 * Seven Memory 主入口文件
 * 7 层记忆系统技能包
 */

// 导入模块
const fs = require('fs');
const path = require('path');

// 记忆系统版本
const VERSION = '1.0.0';

// 主函数
function main() {
  console.log('=== Seven Memory ===');
  console.log(`Version: ${VERSION}`);
  console.log('7 层记忆系统技能包');
  console.log('基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路');
  console.log('');
  console.log('可用命令:');
  console.log('  npm run init    - 初始化记忆目录结构');
  console.log('  npm run test    - 运行自动化测试');
  console.log('  npm run monitor - 运行系统监控');
  console.log('  npm run optimize - 运行性能优化');
  console.log('  npm start       - 启动监控服务');
  console.log('');
  console.log('详细文档请查看 README.md 和 USAGE.md');
}

// 导出模块
module.exports = {
  VERSION,
  main
};

// 运行主函数
if (require.main === module) {
  main();
}