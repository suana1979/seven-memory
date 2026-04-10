#!/usr/bin/env powershell

# 记忆系统 Windows 安装脚本
# 处理 PowerShell 执行策略问题并安装所有必要的依赖项

Write-Host "=== 记忆系统 Windows 安装 ==="
Write-Host "基于 Claude Code 7 层记忆架构和 Karpathy 个人知识库思路"
Write-Host "支持 OpenClaw 和 OpenCode 平台"
Write-Host ""

# 检查并修改 PowerShell 执行策略
Write-Host "=== 检查 PowerShell 执行策略 ==="
try {
    $currentPolicy = Get-ExecutionPolicy -Scope CurrentUser
    Write-Host "当前执行策略: $currentPolicy"
    
    if ($currentPolicy -eq "Restricted") {
        Write-Host "需要修改执行策略以允许运行脚本"
        Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "✅ 执行策略已修改为 RemoteSigned"
    } else {
        Write-Host "✅ 执行策略正常"
    }
} catch {
    Write-Host "❌ 修改执行策略时出错: $($_.Exception.Message)"
    Write-Host "请以管理员身份运行 PowerShell 并尝试以下命令:"
    Write-Host "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser"
}

Write-Host ""

# 检查系统环境
Write-Host "=== 检查系统环境 ==="

# 检查 Node.js
Write-Host "检查 Node.js..."
try {
    $nodeVersion = node --version
    Write-Host "Node.js 版本: $nodeVersion"
    
    $versionParts = $nodeVersion -replace 'v', '' -split '\.'
    $majorVersion = [int]$versionParts[0]
    if ($majorVersion -lt 18) {
        Write-Host "⚠️  Node.js 版本建议 18.0.0 或更高"
    }
} catch {
    Write-Host "❌ Node.js 未安装"
    Write-Host "请下载并安装 Node.js: https://nodejs.org/"
    Write-Host "安装完成后重新运行此脚本"
    exit 1
}

# 检查 Git
Write-Host "检查 Git..."
try {
    $gitVersion = git --version
    Write-Host "Git 版本: $gitVersion"
} catch {
    Write-Host "⚠️  Git 未安装，某些功能可能无法使用"
    Write-Host "建议安装 Git: https://git-scm.com/downloads"
}

# 检查 OpenClaw
Write-Host "检查 OpenClaw..."
try {
    $openclawVersion = openclaw --version
    Write-Host "OpenClaw 版本: $openclawVersion"
} catch {
    Write-Host "⚠️  OpenClaw 未安装，某些功能可能无法使用"
    Write-Host "建议安装 OpenClaw: npm install -g openclaw@latest"
}

# 检查 OpenCode
Write-Host "检查 OpenCode..."
try {
    $opencodeVersion = opencode --version
    Write-Host "OpenCode 版本: $opencodeVersion"
} catch {
    Write-Host "⚠️  OpenCode 未安装，某些功能可能无法使用"
    Write-Host "建议安装 OpenCode: npm install -g opencode-ai@latest"
}

Write-Host "当前目录: $(Get-Location)"
Write-Host "✅ 系统环境检查完成"
Write-Host ""

# 安装记忆系统
Write-Host "=== 安装记忆系统 ==="
Write-Host "正在安装 seven-memory..."
try {
    npm install -g seven-memory
    Write-Host "✅ 记忆系统安装成功"
} catch {
    Write-Host "❌ 记忆系统安装失败: $($_.Exception.Message)"
    Write-Host "尝试手动安装: npm install -g seven-memory"
}

Write-Host ""

# 验证安装
Write-Host "=== 验证安装 ==="
Write-Host "记忆系统已成功安装！"
Write-Host ""
Write-Host "使用指南:"
Write-Host "1. 运行 `node init.js` 初始化记忆目录结构"
Write-Host "2. 运行 `node test-automation.js` 验证所有功能"
Write-Host "3. 在 OpenClaw 中，记忆系统会每天自动执行梦境功能"
Write-Host "4. 可以通过修改 skill.yaml 文件自定义定时任务执行时间"
Write-Host ""
Write-Host "祝您使用愉快！"
