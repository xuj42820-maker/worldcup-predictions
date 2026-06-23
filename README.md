# 世界杯预测文档展示网站

每天的世界杯预测文档集中展示，方便群友随时查看历史预测。

## 快速开始

### 1. 添加新文档

将 Word 文档（.docx）复制到 `docs/` 文件夹

### 2. 更新文档

用新文档替换 `docs/` 里同名的文件

### 3. 部署

```bash
cd D:\世界杯\website
npm run deploy
```

## 本地预览

```bash
npm run build
```

然后用浏览器打开 `index.html` 文件。

## 项目结构

```
├── docs/              # 存放 Word 文档
├── build.js           # 构建脚本
├── template.html      # 网页模板
├── style.css          # 样式文件
└── package.json       # 项目配置
```

## 常见问题

**Q: 文档没有显示？**
A: 确保是 .docx 格式，放在 `docs/` 文件夹中

**Q: 如何修改网页样式？**
A: 编辑 `style.css` 文件

**Q: 更新后网站没变化？**
A: 等 1-2 分钟，或去 Vercel 控制台手动 Redeploy
