import GitCommitForger from './lib/GitCommitForger.js';
import TextRenderer from './lib/TextRenderer.js';
import ImageRenderer from './lib/ImageRenderer.js';

/**
 * 测试程序
 */
async function runTests() {
    console.log('🧪 开始测试 GitHub Stats Forger...');
    console.log();

    // 测试文本渲染
    console.log('📝 测试文本渲染:');
    const textRenderer = new TextRenderer();
    
    console.log('预览 "HELLO":');
    console.log(textRenderer.previewText('HELLO'));
    
    console.log('预览 "2024":');
    console.log(textRenderer.previewText('2024'));
    
    // 测试贡献数据生成
    const startDate = new Date('2023-01-01');
    const contributions = textRenderer.renderText('HI', startDate, 3);
    console.log(`生成了 ${contributions.length} 个贡献点`);
    console.log('前5个贡献点:');
    contributions.slice(0, 5).forEach(c => {
        console.log(`  ${c.date.toDateString()} - 强度: ${c.intensity}`);
    });
    console.log();

    // 测试 Git 提交伪造器
    console.log('⚙️ 测试 Git 提交伪造器:');
    try {
        const forger = new GitCommitForger('./test-repo');
        console.log('✅ Git 仓库初始化成功');
        
        // 测试创建单个提交
        const testDate = new Date('2023-06-15');
        console.log(`创建测试提交: ${testDate.toDateString()}`);
        forger.createCommitDirect(testDate, '测试提交', 1);
        console.log('✅ 测试提交创建成功');
        
    } catch (error) {
        console.error('❌ Git 测试失败:', error.message);
    }
    console.log();

    // 测试图像渲染（如果有 canvas 依赖）
    console.log('🖼️ 测试图像渲染:');
    try {
        const imageRenderer = new ImageRenderer();
        
        // 测试文本位图创建
        const textBitmap = imageRenderer.createTextBitmap('TEST', 20, 7);
        console.log('文本位图预览:');
        const chars = [' ', '░', '▒', '▓', '█'];
        for (const row of textBitmap) {
            let line = '';
            for (const pixel of row) {
                line += chars[pixel] || ' ';
            }
            console.log(line);
        }
        console.log('✅ 图像渲染测试成功');
        
    } catch (error) {
        console.error('❌ 图像渲染测试失败:', error.message);
        console.log('💡 提示: 运行 npm install 安装 canvas 依赖');
    }
    console.log();

    console.log('🎉 测试完成！');
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}
