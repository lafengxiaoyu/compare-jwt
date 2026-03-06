# JWT Compare Tool

一个用于对比JWT文件或Git commit中JWT变化的Web应用，支持生成多种格式的报告。

## 功能特性

- 🔐 **JWT文件对比**: 输入两个JWT token，自动decode并可视化差异
- 🌍 **多环境对比**: 同时对比多个环境（prd/acc/tst）中的JWT变化，支持全局检测
- 📄 **报告生成**: 支持 Markdown、HTML、JSON 三种格式的报告导出
- 🎨 **类GitHub Diff界面**: 类似GitHub的代码对比界面，清晰展示增删改
- 📋 **Claims Table视图**: 以表格形式展示JWT claims，支持左右同步滚动
- 🚀 **实时预览**: 即时查看对比结果
- 📚 **使用手册**: 内置详细的使用指南

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Node.js + Express
- **Git操作**: simple-git
- **JWT解析**: jwt-decode
- **差异对比**: diff

## 安装

```bash
npm install
```

## 运行

### 开发模式

需要同时运行前端和后端：

```bash
# 终端1 - 启动前端
npm run dev

# 终端2 - 启动后端
npm run server
```

然后访问 http://localhost:3000

### 生产模式

```bash
npm run build
npm run preview
```

## 使用方法

### 1. JWT文件对比

1. 点击 "JWT文件对比" 标签
2. 在左侧输入框粘贴第一个JWT token
3. 在右侧输入框粘贴第二个JWT token
4. 点击 "对比 JWT/JWE" 按钮
5. 查看解码后的JSON差异对比

**视图切换**:
- **Diff View**: 类似GitHub的左右对比视图
- **Claims Table**: 表格视图，每个claim一行，支持行级高亮和左右同步滚动

### 2. 多环境对比（推荐）

这个功能适合在多个环境（prd/acc/tst）中追踪JWT配置的变化，也支持全局检测所有变化的文件。

#### 使用场景
- 你在prd、acc、tst等多个环境更新了JWT配置
- 需要查看某个commit前后所有环境中的JWT变化
- 需要对比新增的endpoint、修改的manifestVersion等
- 文件不在标准环境目录中，需要全局检测

#### 使用步骤

1. 点击 "多环境对比" 标签

2. 配置参数：
   - **API地址**: 后端服务地址（默认 http://localhost:3001）
   - **仓库路径**: 你的Git仓库的绝对路径
     - 例如: `/Users/yourname/projects/my-repo`
   - **Commit 1（起始）**: 变更前的commit
     - 例如: `HEAD~10` 或具体commit hash `abc123`
   - **Commit 2（结束）**: 变更后的commit
     - 例如: `HEAD` 或具体commit hash `def456`
   - **环境目录（可选）**: 指定环境目录路径，逗号分隔
     - 例如: `config/prd, config/acc, config/tst`
     - 如果留空，系统会自动检测常见环境目录
     - 如果没有检测到标准环境目录，会全局处理所有变化的文件

3. 点击 "多环境对比" 按钮

4. 查看结果：
   - **汇总卡片**: 显示每个环境修改的JWT文件数量
   - **详细信息**: 每个JWT文件的变更统计
     - 绿色数字: 新增行数
     - 红色数字: 删除行数
     - 灰色数字: 未变行数
   - **Diff视图**: 显示具体的变更内容

5. 生成报告：
   - 对比完成后，点击下方对应的下载按钮
   - 📄 下载 Markdown 报告
   - 🌐 下载 HTML 报告
   - 📦 下载 JSON 报告

#### 环境目录自动检测

如果"环境目录"留空，系统会自动检测包含以下关键词的目录：
- `prd`, `prod`, `production` - 生产环境
- `acc`, `acceptance` - 验收环境
- `tst`, `test` - 测试环境
- `stg`, `staging` - 预发布环境
- `dev` - 开发环境

如果未检测到任何标准环境目录，系统会自动处理所有变化的文件（全局检测）。

#### 示例

假设你的仓库结构如下：
```
my-repo/
├── config/
│   ├── prd/
│   │   └── jwt.json
│   ├── acc/
│   │   └── jwt.json
│   └── tst/
│       └── jwt.json
└── test-data/
    └── test.jose
```

使用方式：
- **方式1（手动指定）**: 环境目录填写 `config/prd, config/acc, config/tst`
- **方式2（自动检测）**: 环境目录留空，系统自动识别
- **方式3（全局检测）**: 如果文件不在标准环境目录（如 test-data/），系统会自动处理

对比结果会显示：
```
对比结果汇总
┌─────────────┬───────────┐
│ config/prd  │ 2 个JWT  │
│ config/acc  │ 2 个JWT  │
│ config/tst  │ 2 个JWT  │
└─────────────┴───────────┘

环境: config/prd
┌─────────────────────────────────┐
│ 文件: jwt.json                │
│ +5 行  -2 行  30 行未变       │
│                                │
│ [详细Diff内容]                 │
└─────────────────────────────────┘
```

### 3. 报告生成

本工具支持生成三种格式的报告，适用于不同的使用场景。

#### 报告格式

1. **Markdown 格式**
   - 易于阅读和编辑
   - 支持 GitHub 风格的 diff 语法
   - 适合文档分享和 Git 提交
   - 文件名示例: `jwt-compare-report-2026-03-06.markdown`

2. **HTML 格式**
   - 美观的渲染效果
   - 支持语法高亮
   - 适合在浏览器中查看
   - 可直接分享给团队
   - 文件名示例: `jwt-compare-report-2026-03-06.html`

3. **JSON 格式**
   - 机器可读的结构化数据
   - 适合程序处理和自动化集成
   - 包含完整的变更信息
   - 文件名示例: `jwt-compare-report-2026-03-06.json`

#### 通过网页生成报告

1. 在"多环境对比"页面完成对比后
2. 点击对应的下载按钮：
   - 📄 下载 Markdown 报告
   - 🌐 下载 HTML 报告
   - 📦 下载 JSON 报告
3. 报告会自动下载到本地

#### 通过命令行生成报告

使用内置脚本：

```bash
# 生成 Markdown 报告（所有文件）
./scripts/generate-report.sh /path/to/repo commit1 commit2

# 生成 HTML 报告（指定文件）
./scripts/generate-report.sh /path/to/repo commit1 commit2 test-data/test.jose html

# 生成 JSON 报告
./scripts/generate-report.sh /path/to/repo commit1 commit2 '' json
```

#### 通过 curl 生成报告

```bash
# 生成 Markdown 报告
curl -X POST http://localhost:3001/api/git/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "repoPath": "/path/to/repo",
    "commit1": "commit1-hash",
    "commit2": "commit2-hash",
    "format": "markdown"
  }' | python3 -c "import sys, json; data = json.load(sys.stdin); open(data['filename'], 'w').write(data['report']); print('Saved:', data['filename'])"

# 生成 HTML 报告（指定文件）
curl -X POST http://localhost:3001/api/git/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "repoPath": "/path/to/repo",
    "commit1": "commit1-hash",
    "commit2": "commit2-hash",
    "file": "test-data/test.jose",
    "format": "html"
  }' | python3 -c "import sys, json; data = json.load(sys.stdin); open(data['filename'], 'w').write(data['report']); print('Saved:', data['filename'])"
```

### 4. 使用手册

点击 "📚 使用手册" 标签，可以查看详细的使用指南，包括：
- JWT 文件对比的详细说明
- Git 提交对比的详细说明
- 多环境对比的详细说明
- 报告生成的使用方法
- 命令行使用示例
- 常见问题和技巧

## 界面说明

### Diff视图
- **绿色高亮 (+)**: 新增内容
- **红色高亮 (-)**: 删除内容
- **白色**: 未改变的内容
- **左侧面板**: 原始版本（Base）
- **右侧面板**: 对比版本（Compare）

### Claims Table视图
- **Claim列**: JWT claim名称（如 manifestVersion, apis）
- **JWT 1列**: 第一个JWT的值
  - 红色高亮: 被删除的行
  - 白色: 未变化的行
- **JWT 2列**: 第二个JWT的值
  - 绿色高亮: 新增的行
  - 白色: 未变化的行
- **Status列**: 变更状态（Added/Removed/Changed/Unchanged）
- **同步滚动**: 左右两个payload区域同步滚动，方便对比

## 支持的JWT格式

支持标准JWT格式（三个部分用点号分隔）：
```
header.payload.signature
```

也支持：
- 无签名 JWT（2部分）：`header.payload`
- JWE 加密 token（5部分）：`header.encryptedKey.iv.ciphertext.authTag`

自动解码Header和Payload部分，并格式化为JSON进行对比。

## CLI工具

项目提供了两个CLI脚本：

### compare-commits.sh - 快速对比两个commit

```bash
./scripts/compare-commits.sh /path/to/repo HEAD~10 HEAD
```

### generate-report.sh - 生成对比报告

```bash
# 生成 Markdown 报告
./scripts/generate-report.sh /path/to/repo commit1 commit2

# 生成 HTML 报告（指定文件）
./scripts/generate-report.sh /path/to/repo commit1 commit2 test-data/test.jose html

# 生成 JSON 报告
./scripts/generate-report.sh /path/to/repo commit1 commit2 '' json
```

## 注意事项

- Git对比功能需要后端服务器运行
- 仓库路径需要是本地可访问的绝对路径
- Commit可以是hash、分支名或tag（如 HEAD, HEAD~5, main）
- 只识别标准格式的JWT token
- Claims Table视图支持左右同步滚动
- 所有操作都在本地进行，不会上传任何数据到外部服务器（适合银行等严格加密环境）

## 安全性

本工具完全在本地运行，适合：
- 银行等金融机构的严格加密环境
- 不允许上传或爬取数据的企业环境
- Azure DevOps 等内部代码仓库

## 测试

运行单元测试：
```bash
npm test
```

## License

MIT
