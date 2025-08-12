# 🎨 GitHub Stats Forger - 快速上手指南

## 什么是 GitHub Stats Forger？

这是一个用于在 GitHub 贡献图上显示自定义图案的工具。通过创建特定日期的 Git 提交，可以在你的 GitHub profile 页面的贡献日历上"绘制"文字和图像。

## 🚀 快速开始

### 1. 预览效果
```bash
node preview.js "HELLO"
node preview.js "2024"
node preview.js "YOUR_NAME"
```

### 2. 运行完整演示
```bash
node demo.js
```

### 3. 在真实仓库中使用
```bash
# 仅预览，不创建提交
npm start text "HELLO" --preview

# 创建提交（在专门的测试仓库中）
npm start text "HELLO" --start-date 2023-01-01
```

## 📋 支持的字符

- **字母**: A-Z (大写)
- **数字**: 0-9
- **空格**: 支持

## 🎯 示例效果

### "HELLO" 效果预览：
```
█   █ █████ █     █      ███ 
█   █ █     █     █     █   █
█   █ █     █     █     █   █
█████ ████  █     █     █   █
█   █ █     █     █     █   █
█   █ █████ █████ █████  ███ 
```

### "2024" 效果预览：
```
 ███   ███   ███  █  █ 
█   █ █   █ █   █ █  █ 
   █  █  ██    █  █  █ 
  █   █ █ █   █   █████
 █    ██  █  █       █ 
█████  ███  █████    █ 
```

## 🔧 工作原理

1. **字符映射**: 每个字符都有对应的 5×7 像素点阵
2. **日期计算**: 根据 GitHub 贡献图的布局（52周×7天）计算对应日期
3. **提交创建**: 在指定日期创建 Git 提交，强度决定绿色深浅
4. **图案显示**: 推送到 GitHub 后在贡献图上显示

## 📅 GitHub 贡献图说明

- **尺寸**: 52周（列）× 7天（行）
- **时间**: 显示过去一年的贡献
- **颜色**: 根据提交数量显示不同深浅的绿色
- **更新**: 推送到 GitHub 后几分钟内更新

## ⚠️ 重要提示

1. **专用仓库**: 请在专门的测试仓库中使用，避免污染正常项目
2. **学习目的**: 此工具仅用于学习和娱乐，请勿用于欺骗或误导
3. **时区影响**: GitHub 基于 UTC 时间计算贡献
4. **推送必需**: 必须推送到 GitHub 才能在贡献图中显示

## 🛠️ 项目结构

```
github-stats-forger/
├── lib/
│   ├── GitCommitForger.js    # Git 提交操作
│   ├── TextRenderer.js       # 文字渲染引擎
│   └── ImageRenderer.js      # 图像渲染引擎
├── index.js                  # 主程序入口
├── demo.js                   # 演示程序
├── preview.js                # 预览工具
└── examples.js               # 使用示例
```

## 🎨 高级功能

### 自定义强度
```bash
npm start text "HELLO" --intensity 4  # 最高强度（最深绿色）
npm start text "HELLO" --intensity 1  # 最低强度（最浅绿色）
```

### 指定开始日期
```bash
npm start text "HELLO" --start-date 2023-06-01
```

### 清理生成的文件
```bash
npm start clean
```

## 🤝 使用建议

1. **先预览**: 使用 `node preview.js` 先查看效果
2. **测试仓库**: 在新建的测试仓库中尝试
3. **合理规划**: 考虑文字长度和贡献图尺寸
4. **耐心等待**: GitHub 更新贡献图需要一些时间

## 📝 许可证

MIT License - 仅供学习和娱乐使用

---

**🎉 享受创造独特的 GitHub 贡献图的乐趣！**
