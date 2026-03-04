# JWT Compare Tool

一个用于对比JWT文件或Git commit中JWT变化的Web应用。

## 功能特性

- 🔐 **JWT文件对比**: 输入两个JWT token，自动decode并可视化差异
- 📊 **Git Commit对比**: 对比两个commit之间所有JWT文件的变化
- 🎨 **类GitHub Diff界面**: 类似GitHub的代码对比界面，清晰展示增删改
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

### JWT文件对比

1. 点击 "JWT 文件对比" 标签
2. 在左侧输入框粘贴第一个JWT token
3. 在右侧输入框粘贴第二个JWT token
4. 点击 "对比 JWT" 按钮
5. 查看解码后的JSON差异对比

### Git Commit对比

1. 点击 "Git Commit 对比" 标签
2. 输入Git仓库路径（本地路径）
3. 输入要对比的两个commit hash或分支名
4. 点击 "对比 Git Commit" 按钮
5. 系统会自动识别所有JWT文件的变化
6. 点击文件列表中的文件查看详细对比

## 界面说明

- **绿色高亮 (+)**: 新增内容
- **红色高亮 (-)**: 删除内容
- **白色**: 未改变的内容
- **左侧面板**: 原始版本（Base）
- **右侧面板**: 对比版本（Compare）

## 支持的JWT格式

支持标准JWT格式（三个部分用点号分隔）：
```
header.payload.signature
```

自动解码Header和Payload部分，并格式化为JSON进行对比。

## 注意事项

- Git对比功能需要后端服务器运行
- 仓库路径需要是本地可访问的绝对路径
- Commit可以是hash、分支名或tag
- 只识别标准格式的JWT token

## License

MIT
