#!/bin/bash

# Seven Memory System 一键安装脚本
# 用法: curl -fsSL https://raw.githubusercontent.com/suana1979/seven-memory/main/install.sh | sh

set -e

# 颜色定义
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# 显示标题
show_title() {
  echo -e "${GREEN}\n=== Seven Memory System 一键安装 ===${NC}"
  echo -e "基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路"
  echo -e "支持 OpenClaw 和 OpenCode 平台\n"
}

# 检查系统环境
check_environment() {
  echo -e "${GREEN}=== 检查系统环境 ===${NC}"
  
  # 检查 Node.js
  if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装${NC}"
    echo -e "请先安装 Node.js 18.0.0 或更高版本"
    exit 1
  fi
  
  NODE_VERSION=$(node -v)
  echo -e "Node.js 版本: ${YELLOW}$NODE_VERSION${NC}"
  
  # 检查 Git
  if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: Git 未安装${NC}"
    echo -e "请先安装 Git"
    exit 1
  fi
  
  echo -e "${GREEN}✅ 系统环境检查完成${NC}\n"
}

# 安装 Seven Memory System
install_system() {
  echo -e "${GREEN}=== 安装 Seven Memory System ===${NC}"
  
  # 确定安装目录
  if [ -d "~/.openclaw/skills" ]; then
    INSTALL_DIR="~/.openclaw/skills/seven-memory"
  else
    INSTALL_DIR="~/.opencode/skills/seven-memory"
  fi
  
  # 创建安装目录
  mkdir -p "$(eval echo $INSTALL_DIR)"
  
  # 克隆仓库
  echo -e "克隆仓库..."
  git clone https://github.com/suana1979/seven-memory.git "$(eval echo $INSTALL_DIR)"
  
  # 进入安装目录
  cd "$(eval echo $INSTALL_DIR)"
  
  # 运行安装脚本
  echo -e "运行安装配置..."
  node install.js
  
  echo -e "${GREEN}✅ Seven Memory System 安装完成${NC}\n"
}

# 显示使用说明
show_usage() {
  echo -e "${GREEN}=== 使用说明 ===${NC}"
  echo -e "1. 初始化记忆目录: ${YELLOW}node init.js${NC}"
  echo -e "2. 运行自动化测试: ${YELLOW}node test-automation.js${NC}"
  echo -e "3. 运行系统监控: ${YELLOW}node monitoring.js --run${NC}"
  echo -e "4. 运行性能优化: ${YELLOW}node performance-optimization.js${NC}"
  echo -e "5. 手动执行梦境功能: ${YELLOW}node dream.js${NC}"
  echo -e "\n${GREEN}系统会每天自动执行梦境功能，巩固记忆${NC}"
  echo -e "可以通过修改 skill.yaml 文件自定义定时任务执行时间"
}

# 主安装流程
main() {
  show_title
  check_environment
  install_system
  show_usage
  
  echo -e "\n${GREEN}🎉 Seven Memory System 安装成功！${NC}"
  echo -e "祝您使用愉快！"
}

# 运行安装流程
main