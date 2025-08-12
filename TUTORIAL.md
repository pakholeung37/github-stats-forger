# 🚀 GitHub Stats Forger 完整使用示例

## 步骤 1: 创建专用仓库

在 GitHub 上创建一个新的仓库，例如 `my-github-art`：

```bash
# 克隆新仓库
git clone https://github.com/YOUR_USERNAME/my-github-art.git
cd my-github-art

# 或者在现有目录初始化
git init
git remote add origin https://github.com/YOUR_USERNAME/my-github-art.git
```

## 步骤 2: 在仓库中使用工具

```bash
# 复制 GitHub Stats Forger 到你的项目
cp -r /path/to/github-stats-forger ./stats-forger
cd stats-forger

# 预览效果
node preview.js "HELLO"

# 创建提交（使用当前目录的上级作为 Git 仓库）
npm start text "HELLO" --start-date 2023-01-01 --repository ../
```

## 步骤 3: 推送到 GitHub

```bash
# 回到仓库根目录
cd ..

# 查看生成的文件
ls -la stats-forger/data/

# 添加所有文件并推送
git add .
git commit -m "Add GitHub stats art"
git push origin main
```

## 步骤 4: 查看效果

1. 访问你的 GitHub Profile 页面
2. 等待几分钟让 GitHub 更新贡献图
3. 查看贡献日历中的图案

## 🎨 创意使用示例

### 1. 显示年份
```bash
node preview.js "2024"
npm start text "2024" --start-date 2023-01-01
```

### 2. 显示姓名缩写
```bash
node preview.js "JS"  # John Smith
npm start text "JS" --start-date 2023-01-01
```

### 3. 显示技能
```bash
node preview.js "CODE"
npm start text "CODE" --start-date 2023-01-01
```

### 4. 组合多个单词（需要手动调整日期）
```bash
# 第一个单词
npm start text "HELLO" --start-date 2023-01-01

# 第二个单词（稍后开始）
npm start text "WORLD" --start-date 2023-03-01
```

## 📊 贡献强度说明

- **强度 1**: 浅绿色 (1-3 次提交)
- **强度 2**: 中等绿色 (4-6 次提交)  
- **强度 3**: 较深绿色 (7-9 次提交)
- **强度 4**: 最深绿色 (10+ 次提交)

```bash
# 使用不同强度
npm start text "HELLO" --intensity 1  # 浅色
npm start text "HELLO" --intensity 4  # 深色
```

## 🎯 最佳实践

### 1. 规划布局
```bash
# 先预览确认效果
node preview.js "YOUR_TEXT"

# 检查日期范围是否合适
# GitHub 贡献图显示过去一年的数据
```

### 2. 选择合适的开始日期
```bash
# 建议从一年前开始
npm start text "HELLO" --start-date $(date -d "1 year ago" +%Y-%m-%d)

# 或者指定具体日期
npm start text "HELLO" --start-date 2023-01-01
```

### 3. 批量操作
```javascript
// 在 examples.js 中有批量创建的示例
// 可以一次性创建多个单词的图案
```

## 🔧 故障排除

### 问题 1: 提交失败
```bash
# 检查 Git 仓库状态
git status

# 确保在正确的仓库目录
pwd
git remote -v
```

### 问题 2: 贡献图不显示
- 确保推送到了 GitHub
- 等待几分钟让 GitHub 更新
- 检查提交的邮箱是否与 GitHub 账户匹配

### 问题 3: 图案位置偏移
- GitHub 贡献图基于周日开始
- 调整开始日期到周日：`--start-date 2023-01-01` (确保是周日)

## 🎉 创意灵感

1. **个人品牌**: 显示你的姓名或昵称
2. **技能展示**: "CODE", "AI", "ML", "WEB" 等
3. **年份纪念**: "2024", "GRAD" (毕业年份)
4. **节日问候**: "XMAS", "2024" (新年)
5. **项目名称**: 显示你的开源项目名

## 📝 注意事项

1. **合规使用**: 仅用于学习和个人娱乐
2. **专用仓库**: 不要在重要项目中使用
3. **备份数据**: 操作前备份重要的 Git 历史
4. **尊重平台**: 不要滥用 GitHub 服务

---

**祝你创造出独特而有趣的 GitHub 贡献图！** 🎨✨
