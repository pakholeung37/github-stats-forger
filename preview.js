#!/usr/bin/env node

import TextRenderer from './lib/TextRenderer.js';

/**
 * 简单的预览工具 - 仅用于预览文字效果
 */

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('🎨 GitHub Stats Forger - 预览工具');
    console.log();
    console.log('使用方法:');
    console.log('  node preview.js "YOUR_TEXT"');
    console.log();
    console.log('示例:');
    console.log('  node preview.js "HELLO"');
    console.log('  node preview.js "2024"');
    console.log('  node preview.js "GITHUB"');
    process.exit(0);
}

const text = args[0];
const textRenderer = new TextRenderer();

console.log(`🎨 预览文字: "${text}"`);
console.log();
console.log('像素化效果:');
console.log(textRenderer.previewText(text));

// 计算贡献点数量
const startDate = new Date('2023-01-01');
const contributions = textRenderer.renderText(text, startDate, 3);
console.log(`📊 需要 ${contributions.length} 个提交来显示 "${text}"`);

// 显示日期范围
if (contributions.length > 0) {
    const firstDate = contributions[0].date;
    const lastDate = contributions[contributions.length - 1].date;
    console.log(`📅 日期范围: ${firstDate.toDateString()} 到 ${lastDate.toDateString()}`);
}

console.log();
console.log('💡 要在真实仓库中使用，请运行:');
console.log(`   npm start text "${text}" --start-date 2023-01-01`);
console.log('   npm start text "${text}" --preview  # 仅预览，不创建提交');
