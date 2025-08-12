#!/usr/bin/env node

import { Command } from 'commander';
import GitCommitForger from './lib/GitCommitForger.js';
import TextRenderer from './lib/TextRenderer.js';
import ImageRenderer from './lib/ImageRenderer.js';

const program = new Command();

program
    .name('github-stats-forger')
    .description('在 GitHub 贡献图上显示自定义图案')
    .version('1.0.0');

// 文字命令
program
    .command('text <content>')
    .description('在贡献图上显示文字')
    .option('-s, --start-date <date>', '开始日期 (YYYY-MM-DD)', getDefaultStartDate())
    .option('-i, --intensity <number>', '提交强度 (1-4)', '3')
    .option('-r, --repository <path>', 'Git 仓库路径', '.')
    .option('-p, --preview', '仅预览，不创建提交')
    .action(async (content, options) => {
        try {
            const textRenderer = new TextRenderer();
            const startDate = new Date(options.startDate);
            const intensity = parseInt(options.intensity);
            
            // 验证参数
            if (isNaN(startDate.getTime())) {
                console.error('❌ 无效的开始日期格式，请使用 YYYY-MM-DD');
                process.exit(1);
            }
            
            if (intensity < 1 || intensity > 4) {
                console.error('❌ 强度值必须在 1-4 之间');
                process.exit(1);
            }
            
            console.log(`🎨 渲染文字: "${content}"`);
            console.log(`📅 开始日期: ${startDate.toDateString()}`);
            console.log(`💪 提交强度: ${intensity}`);
            console.log();
            
            // 预览
            console.log('📋 预览效果:');
            console.log(textRenderer.previewText(content));
            console.log();
            
            if (options.preview) {
                console.log('✅ 预览完成');
                return;
            }
            
            // 生成贡献数据
            const contributions = textRenderer.renderText(content, startDate, intensity);
            console.log(`📊 将创建 ${contributions.length} 个提交`);
            
            // 确认
            const confirmed = await confirm('是否继续创建提交？');
            if (!confirmed) {
                console.log('❌ 操作已取消');
                return;
            }
            
            // 创建提交
            const forger = new GitCommitForger(options.repository);
            
            console.log('⚡ 开始创建提交...');
            const progressBar = createProgressBar(contributions.length);
            
            for (let i = 0; i < contributions.length; i++) {
                const { date, intensity: commitIntensity } = contributions[i];
                forger.createCommitDirect(date, `Add stats for ${content}`, commitIntensity);
                progressBar.update(i + 1);
            }
            
            console.log();
            console.log('✅ 提交创建完成！');
            console.log('💡 提示: 使用 `git push` 将更改推送到 GitHub');
            
        } catch (error) {
            console.error('❌ 错误:', error.message);
            process.exit(1);
        }
    });

// 图像命令
program
    .command('image <path>')
    .description('在贡献图上显示图像')
    .option('-s, --start-date <date>', '开始日期 (YYYY-MM-DD)', getDefaultStartDate())
    .option('-w, --width <number>', '目标宽度')
    .option('-h, --height <number>', '目标高度')
    .option('-r, --repository <path>', 'Git 仓库路径', '.')
    .option('-p, --preview', '仅预览，不创建提交')
    .action(async (imagePath, options) => {
        try {
            const imageRenderer = new ImageRenderer();
            const startDate = new Date(options.startDate);
            const width = options.width ? parseInt(options.width) : null;
            const height = options.height ? parseInt(options.height) : null;
            
            // 验证参数
            if (isNaN(startDate.getTime())) {
                console.error('❌ 无效的开始日期格式，请使用 YYYY-MM-DD');
                process.exit(1);
            }
            
            console.log(`🖼️ 渲染图像: ${imagePath}`);
            console.log(`📅 开始日期: ${startDate.toDateString()}`);
            if (width && height) {
                console.log(`📐 目标尺寸: ${width}x${height}`);
            }
            console.log();
            
            // 预览
            console.log('📋 预览效果:');
            const preview = await imageRenderer.previewImage(imagePath, width, height);
            console.log(preview);
            console.log();
            
            if (options.preview) {
                console.log('✅ 预览完成');
                return;
            }
            
            // 生成贡献数据
            const contributions = await imageRenderer.renderImage(imagePath, startDate, width, height);
            console.log(`📊 将创建 ${contributions.length} 个提交`);
            
            // 确认
            const confirmed = await confirm('是否继续创建提交？');
            if (!confirmed) {
                console.log('❌ 操作已取消');
                return;
            }
            
            // 创建提交
            const forger = new GitCommitForger(options.repository);
            
            console.log('⚡ 开始创建提交...');
            const progressBar = createProgressBar(contributions.length);
            
            for (let i = 0; i < contributions.length; i++) {
                const { date, intensity } = contributions[i];
                forger.createCommitDirect(date, 'Add image stats', intensity);
                progressBar.update(i + 1);
            }
            
            console.log();
            console.log('✅ 提交创建完成！');
            console.log('💡 提示: 使用 `git push` 将更改推送到 GitHub');
            
        } catch (error) {
            console.error('❌ 错误:', error.message);
            process.exit(1);
        }
    });

// 清理命令
program
    .command('clean')
    .description('清理生成的数据文件')
    .option('-r, --repository <path>', 'Git 仓库路径', '.')
    .action((options) => {
        try {
            const forger = new GitCommitForger(options.repository);
            forger.cleanup();
            console.log('✅ 清理完成');
        } catch (error) {
            console.error('❌ 清理失败:', error.message);
        }
    });

// 辅助函数
function getDefaultStartDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
}

async function confirm(message) {
    // 简单的确认实现
    return new Promise((resolve) => {
        process.stdout.write(`${message} (y/N): `);
        process.stdin.once('data', (data) => {
            const answer = data.toString().trim().toLowerCase();
            resolve(answer === 'y' || answer === 'yes');
        });
    });
}

function createProgressBar(total) {
    let current = 0;
    
    return {
        update(value) {
            current = value;
            const percentage = Math.round((current / total) * 100);
            const filled = Math.round((current / total) * 30);
            const empty = 30 - filled;
            
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            process.stdout.write(`\\r⏳ 进度: [${bar}] ${percentage}% (${current}/${total})`);
        }
    };
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('❌ 未捕获的异常:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ 未处理的 Promise 拒绝:', reason);
    process.exit(1);
});

// 解析命令行参数
program.parse();
