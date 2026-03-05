# JWT Compare Tool

一个用于对比JWT文件或Git commit中JWT变化的Web应用。

## 功能特性

- 🔐 **JWT文件对比**: 输入两个JWT token，自动decode并可视化差异
- 📊 **Git Commit对比**: 对比两个commit之间所有JWT文件的变化
- 🌍 **多环境对比**: 同时对比多个环境（prd/acc/tst）中的JWT变化
- 🎨 **类GitHub Diff界面**: 类似GitHub的代码对比界面，清晰展示增删改
- 📋 **Claims Table视图**: 以表格形式展示JWT claims，支持左右同步滚动
- 🚀 **实时预览**: 即时查看对比结果

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

1. 点击 "JWT 对比" 标签
2. 在左侧输入框粘贴第一个JWT token
3. 在右侧输入框粘贴第二个JWT token
4. 点击 "对比 JWT" 按钮
5. 查看解码后的JSON差异对比

**视图切换**:
- **Diff View**: 类似GitHub的左右对比视图
- **Claims Table**: 表格视图，每个claim一行，支持行级高亮和左右同步滚动

### 2. Git Commit对比

1. 点击 "Git 对比" 标签
2. 输入Git仓库路径（本地路径）
3. 输入要对比的两个commit hash或分支名
4. 点击 "对比 Git Commit" 按钮
5. 系统会自动识别所有JWT文件的变化
6. 点击文件列表中的文件查看详细对比

### 3. 多环境对比（推荐用于跨环境变更追踪）

这个功能适合在多个环境（prd/acc/tst）中追踪JWT配置的变化。

#### 使用场景
- 你在prd、acc、tst等多个环境更新了JWT配置
- 需要查看某个commit前后所有环境中的JWT变化
- 需要对比新增的endpoint、修改的manifestVersion等

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

3. 点击 "开始对比" 按钮

4. 查看结果：
   - **汇总卡片**: 显示每个环境修改的JWT文件数量
   - **详细信息**: 每个JWT文件的变更统计
     - 绿色数字: 新增行数
     - 红色数字: 删除行数
     - 灰色数字: 未变行数
   - **Diff视图**: 显示具体的变更内容

#### 环境目录自动检测

如果"环境目录"留空，系统会自动检测包含以下关键词的目录：
- `prd`, `prod`, `production` - 生产环境
- `acc`, `acceptance` - 验收环境
- `tst`, `test` - 测试环境
- `stg`, `staging` - 预发布环境
- `dev` - 开发环境

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
```

使用方式：
- **方式1（手动指定）**: 环境目录填写 `config/prd, config/acc, config/tst`
- **方式2（自动检测）**: 环境目录留空，系统自动识别

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

自动解码Header和Payload部分，并格式化为JSON进行对比。

## CLI工具

项目还提供了一个CLI脚本用于快速对比两个commit：

```bash
./scripts/compare-commits.sh /path/to/repo HEAD~10 HEAD
```

## 注意事项

- Git对比功能需要后端服务器运行
- 仓库路径需要是本地可访问的绝对路径
- Commit可以是hash、分支名或tag（如 HEAD, HEAD~5, main）
- 只识别标准格式的JWT token
- Claims Table视图支持左右同步滚动

## 测试

运行单元测试：
```bash
npm test
```

## License

MIT
