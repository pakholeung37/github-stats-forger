import TextRenderer from './lib/TextRenderer.js';
import ImageRenderer from './lib/ImageRenderer.js';

/**
 * 简单演示程序 - 仅展示渲染效果，不执行Git操作
 */

console.log('🎨 GitHub Stats Forger - 演示程序');
console.log('='.repeat(50));
console.log();

// 演示1: 文字渲染
console.log('📝 演示1: 文字渲染');
const textRenderer = new TextRenderer();

const words = ['HELLO', 'WORLD', '2024', 'CODE'];

for (const word of words) {
    console.log(`"${word}" 的像素化效果:`);
    console.log(textRenderer.previewText(word));
    
    const startDate = new Date('2023-01-01');
    const contributions = textRenderer.renderText(word, startDate, 3);
    console.log(`📊 需要 ${contributions.length} 个提交来显示 "${word}"`);
}

console.log();
console.log('='.repeat(50));
console.log();

// 演示2: 自定义图案
console.log('🎨 演示2: 自定义图案');

// 心形图案
const heartPattern = [
    [0, 3, 3, 0, 3, 3, 0],
    [3, 4, 4, 3, 4, 4, 3],
    [3, 4, 4, 4, 4, 4, 3],
    [0, 3, 4, 4, 4, 3, 0],
    [0, 0, 3, 4, 3, 0, 0],
    [0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

console.log('心形图案:');
const chars = [' ', '░', '▒', '▓', '█'];
for (const row of heartPattern) {
    let line = '';
    for (const pixel of row) {
        line += chars[pixel] || ' ';
    }
    console.log(line);
}

// 笑脸图案
const smilePattern = [
    [0, 0, 3, 3, 3, 0, 0],
    [0, 3, 0, 0, 0, 3, 0],
    [3, 0, 3, 0, 3, 0, 3],
    [3, 0, 0, 0, 0, 0, 3],
    [3, 0, 3, 0, 3, 0, 3],
    [0, 3, 0, 3, 0, 3, 0],
    [0, 0, 3, 3, 3, 0, 0]
];

console.log('笑脸图案:');
for (const row of smilePattern) {
    let line = '';
    for (const pixel of row) {
        line += chars[pixel] || ' ';
    }
    console.log(line);
}

console.log();
console.log('='.repeat(50));
console.log();

// 演示3: 贡献强度效果
console.log('💪 演示3: 不同强度效果');

const intensityDemo = [
    [1, 2, 3, 4, 4, 3, 2, 1],
    [2, 3, 4, 4, 4, 4, 3, 2],
    [3, 4, 4, 4, 4, 4, 4, 3],
    [4, 4, 4, 4, 4, 4, 4, 4],
    [3, 4, 4, 4, 4, 4, 4, 3],
    [2, 3, 4, 4, 4, 4, 3, 2],
    [1, 2, 3, 4, 4, 3, 2, 1]
];

console.log('强度渐变效果 (1-4):');
const intensityChars = [' ', '░', '▒', '▓', '█'];
for (const row of intensityDemo) {
    let line = '';
    for (const pixel of row) {
        line += intensityChars[pixel] || ' ';
    }
    console.log(line);
}

console.log();
console.log('='.repeat(50));
console.log();

// 演示4: 日期计算
console.log('📅 演示4: 贡献图坐标计算');

const demoText = 'HI';
const startDate = new Date('2023-01-01');
const contributions = textRenderer.renderText(demoText, startDate, 3);

console.log(`文字 "${demoText}" 的贡献点分布:`);
console.log(`开始日期: ${startDate.toDateString()}`);
console.log(`总贡献点: ${contributions.length}`);
console.log();

// 显示前10个贡献点的详细信息
console.log('前10个贡献点:');
contributions.slice(0, 10).forEach((contrib, index) => {
    const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][contrib.date.getDay()];
    console.log(`${(index + 1).toString().padStart(2, ' ')}. ${contrib.date.toDateString()} (周${dayOfWeek}) - 强度: ${contrib.intensity}`);
});

if (contributions.length > 10) {
    console.log(`... 还有 ${contributions.length - 10} 个贡献点`);
}

console.log();
console.log('='.repeat(50));
console.log();

// 使用说明
console.log('📖 使用说明:');
console.log();
console.log('要在真实的GitHub仓库中使用这个工具:');
console.log();
console.log('1. 文字显示:');
console.log('   npm start text "YOUR_TEXT" --start-date 2023-01-01');
console.log();
console.log('2. 图像显示:');
console.log('   npm start image ./your-image.png --start-date 2023-01-01');
console.log();
console.log('3. 预览模式 (不创建提交):');
console.log('   npm start text "PREVIEW" --preview');
console.log();
console.log('4. 清理生成的文件:');
console.log('   npm start clean');
console.log();
console.log('⚠️  注意事项:');
console.log('   - 请在专门的仓库中测试，避免污染正常项目');
console.log('   - GitHub的贡献图基于UTC时间计算');
console.log('   - 提交后需要push到GitHub才能在贡献图中显示');
console.log('   - 此工具仅用于学习和娱乐目的');
console.log();
console.log('🎉 演示完成！');
