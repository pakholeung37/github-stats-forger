import GitCommitForger from './lib/GitCommitForger.js';
import TextRenderer from './lib/TextRenderer.js';
import ImageRenderer from './lib/ImageRenderer.js';

/**
 * 使用示例
 */

// 示例 1: 显示文字 "HELLO"
export async function exampleText() {
    console.log('📝 示例: 显示文字 "HELLO"');
    
    const textRenderer = new TextRenderer();
    const forger = new GitCommitForger('./example-repo');
    
    // 设置开始日期（一年前）
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    // 渲染文字
    const contributions = textRenderer.renderText('HELLO', startDate, 3);
    
    console.log(`将创建 ${contributions.length} 个提交`);
    console.log('预览:');
    console.log(textRenderer.previewText('HELLO'));
    
    // 创建提交（注释掉以避免实际执行）
    /*
    for (const { date, intensity } of contributions) {
        forger.createCommitDirect(date, 'Add hello stats', intensity);
    }
    */
    
    console.log('✅ 示例完成');
}

// 示例 2: 显示数字 "2024"
export async function exampleNumbers() {
    console.log('🔢 示例: 显示数字 "2024"');
    
    const textRenderer = new TextRenderer();
    
    console.log('预览:');
    console.log(textRenderer.previewText('2024'));
    
    const startDate = new Date('2023-01-01');
    const contributions = textRenderer.renderText('2024', startDate, 4);
    
    console.log(`生成了 ${contributions.length} 个贡献点`);
    console.log('✅ 示例完成');
}

// 示例 3: 自定义图案
export async function exampleCustomPattern() {
    console.log('🎨 示例: 自定义图案');
    
    const imageRenderer = new ImageRenderer();
    
    // 创建心形图案
    const heartPattern = [
        [0, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    
    const startDate = new Date('2023-01-01');
    const contributions = imageRenderer.pixelsToContributions(heartPattern, startDate);
    
    console.log(`心形图案包含 ${contributions.length} 个点`);
    
    // 预览
    const chars = [' ', '♥'];
    for (const row of heartPattern) {
        let line = '';
        for (const pixel of row) {
            line += chars[pixel] || ' ';
        }
        console.log(line);
    }
    
    console.log('✅ 示例完成');
}

// 示例 4: 批量操作
export async function exampleBatch() {
    console.log('⚡ 示例: 批量创建提交');
    
    const textRenderer = new TextRenderer();
    const forger = new GitCommitForger('./batch-repo');
    
    const words = ['CODE', 'LOVE', 'LIFE'];
    const allContributions = [];
    
    let currentDate = new Date('2023-01-01');
    
    for (const word of words) {
        const contributions = textRenderer.renderText(word, currentDate, 2);
        allContributions.push(...contributions);
        
        // 下一个单词开始位置偏移
        currentDate.setDate(currentDate.getDate() + (word.length * 6 + 2) * 7);
    }
    
    console.log(`总共需要创建 ${allContributions.length} 个提交`);
    
    // 使用批量方式创建（更高效）
    const commits = allContributions.map(({ date, intensity }) => ({
        date,
        message: 'Batch stats update',
        intensity
    }));
    
    // forger.createCommitsBatch(commits); // 注释掉避免实际执行
    
    console.log('✅ 批量示例完成');
}

// 运行所有示例
export async function runExamples() {
    console.log('🚀 运行 GitHub Stats Forger 示例');
    console.log('='.repeat(50));
    
    await exampleText();
    console.log();
    
    await exampleNumbers();
    console.log();
    
    await exampleCustomPattern();
    console.log();
    
    await exampleBatch();
    console.log();
    
    console.log('🎉 所有示例运行完成！');
    console.log();
    console.log('💡 使用提示:');
    console.log('  npm start text "你的文字" --start-date 2023-01-01');
    console.log('  npm start image ./your-image.png --start-date 2023-01-01');
    console.log('  npm start clean  # 清理生成的文件');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    runExamples().catch(console.error);
}
